import React, { useEffect, useState } from 'react';
import {
    Typography,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@material-tailwind/react";
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { createAxios } from '@/configs/axios';
import { toast } from 'react-toastify';
import { convertDate } from '../../utils/util';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import { useAudioController } from '@/context/audio';
import { setAudioInfo } from '@/context/audio';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';
import { setListHistoryAudios } from '@/context/audio';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';

const HistoryAudio = () => {
    // const [listHistory, setListHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [controller, dispatch] = useAudioController();
    const { listHistoryAudios, isPlay, id } = controller;
    const [hasMore, setHasMore] = useState(true);

    const axios = createAxios();
    useEffect(() => {
        try {
            const fetchHistory = async () => {
                const param = {
                    page,
                    limit
                }
                const { data } = await axios.get("/audio/history", { params: param });
                if (data.data.length === 0) {
                    setHasMore(false);
                }
                const history = [...data.data];
                setListHistoryAudios(dispatch, history);
            }
            fetchHistory();
        } catch (error) {
            toast.error("Error when fetch data")
        }
    }, [])

    const handleSelectAudio = (item) => {
        setAudioInfo(dispatch, {
            text: item.textOrigin,
            speaker: item.speaker,
            id: item.id,
            linkAudio: `http://192.168.1.142:2214/${item.linkAudio}`,
        });
    }

    // load more
    useEffect(() => {
        try {
            const fetchHistory = async () => {
                const param = {
                    page,
                    limit
                }
                const { data } = await axios.get("/audio/history", { params: param });
                if (data.data.length === 0) {
                    setHasMore(false);
                }
                const history = [...listHistoryAudios, ...data.data];
                setListHistoryAudios(dispatch, history);
            }
            fetchHistory();
        } catch (error) {
            setHasMore(false);
            toast.error("Error when fetch data")

        }
    }, [page])

    // render play icon
    const renderPlayIcon = (item) => {
        if (isPlay && id === item.id) {
            return <PauseCircleOutlinedIcon color="secondary" />
        }
        return <PlayCircleOutlineIcon color="secondary" />
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
                    Lịch sử chuyển đổi
                </Typography>

            </CardHeader>
            <CardBody className="pt-0 pb-0  overflow-y-auto" id="scrollableDiv">
                <InfiniteScroll
                    dataLength={listHistoryAudios.length}
                    next={() => setPage(page + 1)}
                    hasMore={hasMore}
                    scrollableTarget="scrollableDiv"
                    loader={<div className='w-[100%] text-center'><CircularProgress color="secondary" style={{ width: "20px", height: "20px" }} /></div>}
                >
                    {
                        listHistoryAudios.map((item, index) => (
                            <Card className={`card w-full shadow-xl mt-2 pb-0 rounded-md ${id == item.id && 'bg-[#ede9fe]'}`} key={index} onClick={() => handleSelectAudio(item)}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6" color="blue-gray" className="mb-2 max-w-[70%] truncate">
                                            {item?.title || item.textOrigin}
                                        </Typography>
                                        <Typography className="h-full w-full pb-3 flex gap-3 mt-2">
                                            {renderPlayIcon(item)}

                                            <p className='max-h-[150px] max-w-full  overflow-hidden text-ellipsis'>
                                                {item.textOrigin}
                                            </p>
                                        </Typography>
                                        <div className='flex items-center justify-between font-thin text-xs'>
                                            <p>Ngày tạo: {convertDate(item.createdAt)}</p>
                                            <p className='flex items-center'> <RecordVoiceOverOutlinedIcon className='mr-2' />{item.speaker}</p>
                                        </div>
                                    </CardContent>
                                </CardActionArea>

                            </Card>
                        ))
                    }
                    <div className='mt-5'></div>
                </InfiniteScroll>
            </CardBody>

        </Card>
    );
};

export default HistoryAudio;