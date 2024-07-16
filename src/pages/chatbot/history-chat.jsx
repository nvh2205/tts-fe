import React, { useEffect, useState, useRef, forwardRef, useCallback } from "react";
import "react-h5-audio-player/lib/styles.css";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { createAxios } from '../../configs/axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from "react-toastify";

const HistoryChat = (props) => {

    const { titleChat, setTitleChat, chatCode, setChatCode, setListMessage, setParentMessageId } = props;

    const api = createAxios();

    const [listHistory, setListHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // get history chat
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await api.get("/chat/all-title", {
                    params: {
                        page,
                        limit
                    }
                });
                const data = res.data.data;
                if (data.length === 0) {
                    setHasMore(false);
                }
                if (page === 1) {
                    setListHistory(data);
                    setLoading(false);
                    return;
                }
                const history = [...listHistory, ...data];
                setListHistory(history);
                setLoading(false);
            } catch (error) {
                // toast.error("Error!! Không thể lấy dữ liệu lịch sử chat")
            }
        }
        fetchHistory();
    }, [page]);

    useEffect(() => {
        // add new chat to history
        if (titleChat !== '' && chatCode !== '') {
            const newChat = {
                title: titleChat,
                chatCode: chatCode
            }
            const newHistory = [newChat, ...listHistory];
            setListHistory(newHistory);
        }
    }, [titleChat, chatCode])

    // get conversation
    const getConversation = async (chatCode) => {
        try {
            setChatCode(chatCode);
            setTitleChat('');
            const res = await api.get(`/chat/${chatCode}`, {
                params: {
                    page: 1,
                    limit: 20
                }

            });
            if (res.data.data.length === 0) {
                return;
            }
            setParentMessageId(res.data.data[0].parentMessageId);
            const reverseData = res.data.data.reverse();
            setListMessage([...reverseData]);
        } catch (error) {
            toast.error("Error!! Không thể lấy dữ liệu lịch sử chat")
        }
    }
    return (
        <Card className="border border-blue-gray-100 shadow-sm max-h-[668px]">
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 p-6 "
            >
                <Typography variant="h6" color="blue-gray" className="mb-2 text-xl font-semibold ">
                    Lịch sử Chat
                </Typography>

            </CardHeader>
            <CardBody className="pt-0 pb-0  overflow-y-auto" id="scrollableDivChat">
                <InfiniteScroll
                    dataLength={listHistory.length}
                    next={() => setPage(page + 1)}
                    hasMore={hasMore}
                    loader={<div className='w-[100%] text-center'><CircularProgress color="secondary" style={{ width: "20px", height: "20px" }} /></div>}
                    scrollableTarget="scrollableDivChat"
                >
                    {listHistory.map((item, index) => {
                        return (
                            <Card className={`card w-full shadow-xl mt-2 pb-0 rounded-md ${chatCode == item.chatCode && 'bg-[#ede9fe]'}`}
                                key={index}
                                onClick={() => getConversation(item.chatCode)}
                            >
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6" color="blue-gray" className="mb-2 max-w-[70%] truncate">
                                            {item.title}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )
                    })}
                    <div className='mt-5'></div>

                </InfiniteScroll>

            </CardBody>
        </Card>
    );
};

export default HistoryChat;