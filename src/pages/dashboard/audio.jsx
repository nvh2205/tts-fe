import React, { useEffect, useState, useRef, forwardRef, useCallback } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    CardFooter,
} from "@material-tailwind/react";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import MenuItem from '@mui/material/MenuItem';
import CachedIcon from '@mui/icons-material/Cached';
import LinearProgress from '@mui/material/LinearProgress';
import { useUserController, setCharPerMonth, setLoadingOverlay } from "@/context/user";
import { createAxios, url } from "@/configs/axios";
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';
import { useAudioController, setLinkAudio, setAudioInfo, setListHistoryAudios, setIsPlay } from "@/context/audio";
const Audio = (props) => {
    const [optionSpeed, setOptionSpeed] = useState([
        0.25, 0.5, 0.75, 1, 1.25, 1.5, 2.0,
    ]);
    const [speed, setSpeed] = useState(1);

    const [optionVoice, setOptionVoice] = useState([
        {
            speaker_id: 0,
            label: "👨  Mr.Alloy",
        },
        {
            speaker_id: 1,
            label: "🧔‍♂️  Mr.Echo",
        },
        {
            speaker_id: 2,
            label: "👩  Ms.Nova",
        },
        {
            speaker_id: 3,
            label: "👱  Mr.Shimmer",
        },
        {
            speaker_id: 4,
            label: "🧑‍🦰  Mr.Fable",
        },
    ])
    const [voice, setVoice] = useState({
        speaker_id: 0,
    });
    const [textInput, setTextInput] = useState("");

    const [loading, setLoading] = useState(false);

    const [useController, dispatchController] = useUserController();
    const { charPerRequest, charPerMonth } = useController;

    const [audioController, dispatchAudioController] = useAudioController();
    const { text, speaker, id, linkAudio, listHistoryAudios } = audioController;


    const api = useCallback(createAxios(), []);

    const handleChangeSpeed = (event) => {
        setSpeed(event.target.value);
    };

    const tagOptionSpeed = (optionSpeed, speed) => {
        return optionSpeed.map((item, index) => (
            <MenuItem
                key={index}
                value={item}
                color="secondary"
            >
                <SpeedOutlinedIcon sx={{ marginRight: "5px" }} /> x{item}
            </MenuItem>
        ));
    };

    const handleChangeVoice = (event) => {
        setVoice({
            speaker_id: event.target.value,
        });
    };

    const handleChangeText = (event) => {
        setTextInput(event.target.value);
    }

    const tagOptionVoice = (optionVoice, voice) => {
        return optionVoice.map((item, index) => (
            <MenuItem
                key={index}
                value={item.speaker_id}
                color="secondary"
            >
                {item.label}
            </MenuItem>
        ));
    }

    // send text to server
    const sendTextToServer = async () => {
        setLoading(true);
        try {
            const textOrigin = textInput;
            const { data } = await api.post("/audio/login-audio", {
                textOrigin: textOrigin,
                speedUp: speed,
                speakerId: voice.speaker_id,
            });
            setLoading(false);
            setAudioInfo(dispatchAudioController, {
                text: textOrigin,
                speaker: data.data.speaker,
                id: data.data.id,
                linkAudio: `${url}/${data.data.linkAudio}`,
            })

            const newHistoryAudio = [...listHistoryAudios];
            newHistoryAudio.unshift({
                id: data.data.id,
                createdAt: data.data.createdAt,
                textOrigin: textOrigin,
                speaker: data.data.speaker,
                id: data.data.id,
                linkAudio: data.data.linkAudio
            })
            console.log(newHistoryAudio, "ne");
            setListHistoryAudios(dispatchAudioController, newHistoryAudio);

            // reduce charPerMonth
            setCharPerMonth(dispatchController, textOrigin.length);
        } catch (error) {
            toast.error("Err: Không thể chuyển đổi văn bản thành âm thanh!");
            setLoading(false);
        }
    }

    // handle web link
    const [webLink, setWebLink] = useState("");
    const [isSubmitWebLink, setIsSubmitWebLink] = useState(false);
    const [loadingWebLink, setLoadingWebLink] = useState(false);

    const handleChangeWebLink = (event) => {
        setWebLink(event.target.value);
    }

    useEffect(() => {
        if (webLink.length) {
            setIsSubmitWebLink(true);
        } else {
            setIsSubmitWebLink(false);
        }
    }, [webLink]);

    // load web link
    const handleLoadTextFromWebLink = async () => {
        setLoadingWebLink(true);
        try {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: webLink,
                }),
            };

            // Send the POST request using fetch
            const response = await fetch('https://thruuu-free-tools-server.herokuapp.com/extract-body-content', options);
            const data = await response.json();
            setLoadingWebLink(false);
            setTextInput(data.content);
        } catch (error) {
            toast.error("Err: Không thể tải văn bản từ web link!");
            setLoadingWebLink(false);
        }
    };
    // set voice and text when click history audio
    useEffect(() => {
        if (!linkAudio) return;
        setTextInput(text);
        const findSpeaker = optionVoice.find((item) => item.label.toLowerCase().includes(speaker.toLowerCase()));
        setVoice({
            speaker_id: findSpeaker.speaker_id,
        });
    }, [linkAudio])

    // handle spped up audio-----------------------------
    const ref = useRef(null);

    const onPlay = () => {
        ref.current.audio.current.playbackRate = speed;
        setIsPlay(dispatchAudioController, true);
    };

    const onPause = () => {
        setIsPlay(dispatchAudioController, false);
    }

    useEffect(() => {
        ref.current.audio.current.playbackRate = speed;
        ref.current.audio.current.play();
    }, [speed]);


    return (
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 flex items-center justify-between p-6 flex-wrap"
            >
                <div>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-filled-label" color="secondary">Tốc Độ Phát</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={speed}
                            onChange={handleChangeSpeed}
                            color="secondary"
                        >
                            {tagOptionSpeed(optionSpeed, speed)}
                        </Select>
                    </FormControl>

                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }} className="">
                        <InputLabel id="demo-simple-select-filled-label" color="secondary">Giọng Đọc</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={voice.speaker_id}
                            onChange={handleChangeVoice}
                            color="secondary"
                        >
                            {tagOptionVoice(optionVoice, voice)}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <TextField id="standard-basic" label="📎 Web Link" variant="standard" color="secondary"
                        value={webLink} onChange={handleChangeWebLink} />
                    <div className={`flex ${loadingWebLink && 'w-[35px]'} items-center gap-1 ${isSubmitWebLink ? "visible" : 'invisible'}`}>
                        {loadingWebLink ? <CircularProgress color="secondary" className="ml-2" />
                            : <CheckOutlinedIcon onClick={handleLoadTextFromWebLink} className=" cursor-pointer text-green-300 hover:text-green-500" />
                        }
                    </div>
                </div>
                <Button
                    size="sm" color="blue-gray" className="mt-5 md:mt-0 flex items-center"
                    disabled={loading || textInput.length > charPerRequest || textInput.length > charPerMonth || textInput.length === 0}
                    onClick={sendTextToServer}
                >
                    Chuyển Đổi
                    <CachedIcon
                        fill="currenColor"
                        className={`h-6 w-6 ml-2 mr-2  ${loading && 'circular'}`}
                    />
                </Button>
            </CardHeader>
            <CardBody className="pt-0 pb-2">
                <TextField
                    id="filled-multiline-static"
                    label="Text"
                    multiline
                    rows={14}
                    variant="filled"
                    className="text-field w-full min-w-[640px]"
                    color="secondary"
                    value={textInput}
                    onChange={handleChangeText}
                />
                <LinearProgress color="secondary" className={loading ? 'visible' : 'invisible'} />
                <p
                    className={`mt-3 text-right 
                        ${(textInput.length < charPerMonth && textInput.length < charPerRequest) ? "text-purple-500" : "text-red-500"} 
                    italic font-mono `}
                >
                    {textInput.length > charPerRequest && "!!"}Ký tự: {textInput.length}/
                    {charPerRequest}
                </p>
            </CardBody>
            <CardFooter>
                <AudioPlayer
                    ref={ref}
                    onPlay={onPlay}
                    onPause={onPause}
                    src={linkAudio}
                    showJumpControls={true}
                    autoPlay={false}
                // other props here
                />
            </CardFooter>
        </Card>
    );
};

export default Audio;
