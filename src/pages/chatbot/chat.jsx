import React, { useEffect, useState, useRef, forwardRef, useCallback } from "react";
import "react-h5-audio-player/lib/styles.css";
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import FormControl from '@mui/material/FormControl';

import IconButton from '@mui/material/IconButton';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { useUserController } from '@/context/user';
import { socketIo } from '@/configs/socket';
import { setMessage } from '@/context/user';
import HistoryChat from "./history-chat";
export function Chat() {
    const [useController, dispatchController] = useUserController();
    const { avatarUrl, messagePerDay } = useController;

    const [answerChatBot, setAnswerChatBot] = useState("");
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [parentMessageId, setParentMessageId] = useState(null);
    const [chatCodeConversation, setChatCodeConversation] = useState("");
    const [userMessage, setUserMessage] = useState("");
    const [endMessage, setEndMessage] = useState(false);

    const [titleChat, setTitleChat] = useState("")

    const [listMessage, setListMessage] = useState([
        {
            role: "assistant",
            content: "Xin chào. Tôi có thể giúp gì cho bạn?",
        },
    ]);

    const [socket, setSocket] = useState();

    const bottomEl = useRef(null);
    const scrollToBottom = () => {
        // bottomEl.current.scrollIntoView({ behavior: "smooth" });
        bottomEl.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    };

    // Auto scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [listMessage]);

    useEffect(() => {
        if (answerChatBot) {
            scrollToBottom();
        }
    }, [answerChatBot]);

    // connect sosket
    useEffect(() => {
        const connectSocket = async () => {
            let connectSocketIo = await socketIo();
            connectSocketIo.connect();
            setSocket(connectSocketIo);
        };
        connectSocket();
    }, []);

    //Listening socket
    useEffect(() => {
        if (socket) {
            let initMessage = ""
            socket.on("messageChat", (value) => {
                const { message, parentMessageId, chatCode } = JSON.parse(value);
                if (initMessage && initMessage == message) {
                    setParentMessageId(parentMessageId);
                    setEndMessage(true);
                    setChatCodeConversation(chatCode);
                    initMessage = "";
                } else {
                    // if (!loadingMessage) {
                    //     setLoadingMessage(false);
                    // }

                    initMessage = message;
                    setLoadingMessage(false);
                    setAnswerChatBot(message);

                }
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);


    //Handle when end message
    useEffect(() => {
        //When end conversation add answerChatBot into list message
        if (endMessage && answerChatBot) {
            const messages = [...listMessage];
            messages.push({
                role: "assistant",
                content: answerChatBot,
            });
            setListMessage(messages);
            setAnswerChatBot("");
        }
    }, [endMessage]);

    const onChangeMessage = (e) => {
        setUserMessage(e.target.value);
    };

    //list error messages socket
    useEffect(() => {
        if (socket) {
            socket.on("error", (err) => {
                setAnswerChatBot("!Assistant Error! ");
                setLoadingMessage(false);
                setEndMessage(true);
            });
        }
    }, [socket]);


    // set title chat when create new chat
    const createTitleChat = (message) => {
        let titleChat = message.split(' ').slice(0, 5).join(' ');
        return titleChat;
    }

    // send message
    const sendMessageChat = () => {
        if (messagePerDay <= 0) {
            toast.error("Bạn đã hết số lần chat trong ngày");
        }

        if (parentMessageId == null && userMessage) {
            setTitleChat(createTitleChat(userMessage));
        }

        const newListMessage = [...listMessage];
        newListMessage.push({
            role: "user",
            content: userMessage,
        });

        setListMessage(newListMessage);
        setLoadingMessage(true);

        const data = {
            message: userMessage,
            parentMessageId: parentMessageId ? parentMessageId : null,
            chatCode: chatCodeConversation ? chatCodeConversation : null,
        };
        setUserMessage("");
        setEndMessage(false);
        socket.emit("chat_message", data, () => {

            //Update number message
            setMessage(dispatchController, 1);
        });
    }

    const handleKeyDownSendMessage = (e) => {
        //Enter key down
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            if (answerChatBot || !userMessage) {
                return;
            }
            sendMessageChat();
            setUserMessage("");
            // e.target.blur();
        }
    };

    const handleNewChat = () => {
        setTitleChat("");
        setChatCodeConversation("");
        setParentMessageId(null);
        setListMessage([
            {
                role: "assistant",
                content: "Xin chào. Tôi có thể giúp gì cho bạn?",
            },]);
    }

    return (
        <div className="mt-10">
            <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm h-[662px]">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="m-0 flex items-center justify-between p-6 flex-wrap"
                    >
                    </CardHeader>
                    <CardBody className="pt-0 pb-2 flex-1 overflow-y-auto">
                        {listMessage.map((item, index) => {
                            if (item.role == "assistant") {
                                return <div className="flex items-start gap-2.5 mb-5" key={index}>
                                    <img className="w-[38px] h-[38px] rounded-full" src="/img/obj-128x128.png" alt="" />
                                    <div className="flex flex-col  max-w-[100%] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                        {/* <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                                    </div> */}
                                        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white whitespace-pre-line">{item.content}</p>
                                    </div>
                                </div>
                            } else {
                                return <div className="flex items-start gap-2.5 mb-5 flex-row-reverse" key={index}>
                                    <Avatar className="w-8 h-8 rounded-full" alt="Cindy Baker" src={avatarUrl} />
                                    <div className="flex flex-col max-w-[100%] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-s-xl rounded-ee-xl dark:bg-gray-700">
                                        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white whitespace-pre-line">{item.content}</p>
                                    </div>
                                </div>
                            }
                        })}
                        {answerChatBot &&
                            <div className="flex items-start gap-2.5 mb-5">
                                <img className="w-[38px] h-[38px] rounded-full" src="/img/obj-128x128.png" alt="" />
                                <div className="flex flex-col w-full max-w-[100%] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                    <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white whitespace-pre-line">{answerChatBot}</p>
                                </div>
                            </div>}

                        {loadingMessage &&
                            <div className="flex items-start gap-2.5 mb-5">
                                <img className="w-[38px] h-[38px] rounded-full" src="/img/obj-128x128.png" alt="" />
                                <div className="flex flex-col max-w-[100%] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                    {/* <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{answerChatBot}</p> */}
                                    <img className="w-[58px] h-[38px] rounded-full" src="/img/loading-chat.gif" alt="Jese image" />
                                </div>
                            </div>}
                        <div ref={bottomEl} />
                    </CardBody>
                    <CardFooter>
                        <div className="flex  w-[100%]">
                            <IconButton
                                color="secondary"
                                aria-label="Tạo đoạn chat mới"
                                onClick={handleNewChat}
                            >
                                <CleaningServicesOutlinedIcon />
                            </IconButton>

                            <FormControl variant="standard" className="flex-1 w-[100%]">
                                <InputLabel htmlFor="standard-adornment-password" color='secondary'>Talk assistant</InputLabel>
                                <Input
                                    color='secondary'
                                    rows={2}
                                    type={'text'}
                                    multiline
                                    onChange={onChangeMessage}
                                    onKeyDown={handleKeyDownSendMessage}
                                    value={userMessage}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={sendMessageChat}
                                                disabled={messagePerDay <= 0 || !userMessage}
                                                color="secondary"
                                            >
                                                <SendOutlinedIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>

                    </CardFooter>
                </Card>
                <HistoryChat
                    titleChat={titleChat}
                    setTitleChat={setTitleChat}
                    chatCode={chatCodeConversation}
                    setChatCode={setChatCodeConversation}
                    setListMessage={setListMessage}
                    setParentMessageId={setParentMessageId}
                />
            </div>
        </div>
    );
}

export default Chat;
