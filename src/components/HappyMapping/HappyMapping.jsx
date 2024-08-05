import React, { useEffect } from 'react';
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
import TheRippleEffect from '../TheRippleEffect/TheRippleEffect';

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

    useEffect(() => {
        dispatch({ type: "SET_HAPPY" });
        dispatch({ type: "SET_BUS" });
    }, [dispatch]);

    const handleLike = (event, id, currentLikeStatus) => {
        event.preventDefault();
        dispatch({ type: currentLikeStatus ? "UNLIKE" : "UPDATE_LIKE", payload: { id } });
    };

    const handleInt = (event, id, currentIntStatus) => {
        event.preventDefault();
        dispatch({ type: currentIntStatus ? "UNINTERESTED" : "UPDATE_INT", payload: { id } });
    };

    const findBusinessName = (businessId) => {
        const business = businesses.find(bus => bus.id === businessId);
        return business ? business.business_name : 'Unknown Business';
    };

    // Sort the happy array by id to maintain consistent order
    const sortedHappy = [...happy].sort((a, b) => a.id - b.id);

    return (
        <>
            <TheRippleEffect/>
            <center><Typography className="textbox" variant="h5" gutterBottom>The Heystack</Typography></center> 
            <Box className="scrollable-card-content" component="section" sx={{ p: 2 }}>
                {sortedHappy.map((item) => {
                    const progressInt = Math.min(100, (item.interested / 100) * 100);
                    const progressLike = Math.min(100, (item.likes / 100) * 100);
                    console.log("item mapping info", item.likes);
                    return (
                        <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    {formatDate(item.date)}
                                </Typography>
                                <Typography variant="h5" component="div">
                                   Location: Minneapolis {item.address}
                                </Typography>
                                <Typography variant="h5" component="div">
                                  Start Time: {new Date(`1970-01-01T${item.start_time}`).toLocaleTimeString('en-US', 
                                    { hour: 'numeric', minute: '2-digit', hour12: true }
                                  )}
                                </Typography>
                                <Typography variant="h5" component="div">
                                  End Time: {new Date(`1970-01-01T${item.end_time}`).toLocaleTimeString('en-US', 
                                    { hour: 'numeric', minute: '2-digit', hour12: true }
                                  )}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Description: {item.description}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={(event) => handleLike(event, item.id, item.userLiked)}
                                    >
                                        {item.userLiked ? 'Unlike' : <RecommendIcon />}
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={(event) => handleInt(event, item.id, item.userInterested)}
                                    >
                                        {item.userInterested ? 'Not Going' : 'Are you going?'}
                                    </Button>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        # Going:
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
                                        <span>{item.interested} Interested</span>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        # Likes:
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
                                        <span>{item.likes} Likes</span>
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