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
import TheRippleEffect from '../TheRippleEffect/TheRippleEffect';

const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return format(date, 'MMM dd, yyyy');
};

const getColor = (value) => {
    const lightBlue = { r: 173, g: 216, b: 230 };
    const dodgerBlue = { r: 30, g: 144, b: 255 };
  
    const interpolate = (start, end, factor) => {
      return Math.round(start + (end - start) * factor);
    };
  
    const factor = value / 100;
    const red = interpolate(dodgerBlue.r, lightBlue.r, factor);
    const green = interpolate(dodgerBlue.g, lightBlue.g, factor);
    const blue = interpolate(dodgerBlue.b, lightBlue.b, factor);
  
    return `rgb(${red},${green},${blue})`;
  };
  

const HappyMapping = () => {
    const happy = useSelector(store => store.happy);
    const businesses = useSelector(store => store.business);
    const dispatch = useDispatch();
    const [clickedEvents, setClickedEvents] = useState({});

    useEffect(() => {
        dispatch({ type: "SET_HAPPY" });
        dispatch({ type: "SET_BUS" });
      
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
<TheRippleEffect/>
<center><Typography className="textbox" variant="h5" gutterBottom>The Heystack</Typography></center> 
            <Box  className="scrollable-card-content" component="section" sx={{ p: 2,  }}>


                {happy.map((item) => {
                    const progressInt = Math.min(100, (item.interested / 100) * 100);
                    const progressLike = Math.min(100, (item.likes / 100) * 100);
                    const clickedState = clickedEvents[item.id] || {};
                    return (
                        <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
                            <CardContent >
                            <Typography variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    {formatDate(item.date)}
                                </Typography>
                                <Typography variant="h5" component="div">
                                   Location:  {item.address}
                                </Typography>
                                <Typography variant="h5" component="div">
                                  Start Time:  {new Date(`1970-01-01T${item.start_time}`).toLocaleTimeString('en-US', 
  { hour: 'numeric', minute: '2-digit', hour12: true }
)}
                                </Typography>
                                <Typography variant="h5" component="div">
                                  End Time:  {new Date(`1970-01-01T${item.end_time}`).toLocaleTimeString('en-US', 
  { hour: 'numeric', minute: '2-digit', hour12: true }
)}
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
