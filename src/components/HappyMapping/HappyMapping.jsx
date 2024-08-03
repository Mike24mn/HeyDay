import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { format } from 'date-fns';
import UserNavBar from "../UserNavBar/UserNavBar";
import "./HappyMapping.css";
import RecommendIcon from '@mui/icons-material/Recommend';

const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return format(date, 'MMM dd, yyyy');
};

const getColor = (value) => {
    const red = Math.min(255, Math.floor((255 * value) / 100));
    const green = Math.min(255, Math.floor((255 * (100 - value)) / 100));
    return `rgb(${red},${green},0)`;
};

const HappyMapping = () => {
    const happy = useSelector(store => store.happy);
    const businesses = useSelector(store => store.business);
    const dispatch = useDispatch();
    const [clickedEvents, setClickedEvents] = useState({});

    useEffect(() => {
        dispatch({ type: "SET_HAPPY" });
        dispatch({ type: "SET_BUS" });
        dispatch({ type: "UPDATE_LIKE" });
    }, [dispatch]);

    const handleLike = (event, id) => {
        event.preventDefault();
        if (id === undefined) {
            console.error('ID is undefined in handleLike');
            return;
        }
        setClickedEvents(prevState => ({ ...prevState, [id]: { ...prevState[id], liked: true } }));
        dispatch({ type: "UPDATE_LIKE", payload: { id } });
    };

    const handleInt = (event, id) => {
        event.preventDefault();
        if (id === undefined) {
            console.error('ID is undefined in handleInt');
            return;
        }
        setClickedEvents(prevState => ({ ...prevState, [id]: { ...prevState[id], interested: true } }));
        dispatch({ type: 'UPDATE_INT', payload: { id } });
    };

    const findBusinessName = (businessId) => {
        const business = businesses.find(bus => bus.id === businessId);
        return business ? business.business_name : 'Unknown Business';
    };

    return (
        <>
            <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                <center><Typography variant="h5" gutterBottom>Hours of Hey for the Day</Typography></center>
                <center>
                    <img
                        src='public/image.png'
                        alt='Happy Hour'
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            width: '300px',
                        }}
                    />
                </center>
                {happy.map((item) => {
                    const progressInt = Math.min(100, (item.interested / 100) * 100);
                    const progressLike = Math.min(100, (item.likes / 100) * 100);
                    const clickedState = clickedEvents[item.id] || {};
                    return (
                        <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {findBusinessName(item.business_id)}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    {formatDate(item.date)}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Where: {item.address}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Start Time: {item.start_time}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    End Time: {item.end_time}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Description: {item.description}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={(event) => handleLike(event, item.id)}
                                        disabled={clickedState.liked}
                                    >
                                        <RecommendIcon />
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={(event) => handleInt(event, item.id)}
                                        disabled={clickedState.interested}
                                    >
                                        Are you going?
                                    </Button>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        People Going:
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={progressInt}
                                        sx={{ 
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: getColor(progressInt),
                                            },
                                        }} 
                                    />
                                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                                        <span>{item.interested} people interested</span>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        People Liked:
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={progressLike}
                                        sx={{ 
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: getColor(progressLike),
                                            },
                                        }} 
                                    />
                                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                                        <span>{item.likes} people liked</span>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions>
                              
                            </CardActions>
                        </Card>
                    );
                })}
            </Box>
            <UserNavBar />
        </>
    );
};

export default HappyMapping;
