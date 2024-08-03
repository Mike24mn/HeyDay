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


// Function to format date
const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return format(date, 'MMM dd, yyyy');
};

// HappyMapping component
const HappyMapping = () => {
    const happy = useSelector(store => store.happy);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: "SET_HAPPY" });
    }, [dispatch]);

    const handleLike = (event, id) => {
        event.preventDefault();
        if (id === undefined) {
            console.error('ID is undefined in handleLike');
            return;
        }
        dispatch({ type: "UPDATE_LIKE", payload: { id } });
    };

    const handleInt = (event, id) => {
        event.preventDefault();
        if (id === undefined) {
            console.error('ID is undefined in handleInt');
            return;
        }
        dispatch({ type: 'UPDATE_INT', payload: { id } });
    };

    return (
        <>
<TheRippleEffect/>
<center><Typography className="textbox" variant="h5" gutterBottom>The Heystack</Typography></center> 
            <Box  className="scrollable-card-content" component="section" sx={{ p: 2,  }}>


                {happy.map((item) => {
                    const progress = Math.min(100, (item.interested / 100) * 100); 
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
                                   Location: Minneapolis {item.address}
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
                                    <Button size="small" onClick={(event) => handleLike(event, item.id)}><RecommendIcon/></Button>
                                    <Button size="small" onClick={(event) => handleInt(event, item.id)}>Are you going?</Button>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        # Going:
                                    </Typography>
                                    <LinearProgress variant="determinate" value={progress} />
                                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                                        <span>{item.interested} Interested</span>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        # Likes:
                                    </Typography>
                                    <LinearProgress variant="determinate" value={Math.min(100, (item.likes / 100) * 100)} />
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
            <UserNavBar  />
        </>
    );
};

export default HappyMapping;
