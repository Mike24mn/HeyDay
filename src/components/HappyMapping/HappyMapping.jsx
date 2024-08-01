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

            <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                <center><Typography variant="h5" gutterBottom>Hours of Hey for the Day</Typography></center> 
               <center><img src='public/image.png' alt='Happy Hour'
                    style={{ 
                        maxWidth: '100%', 
                        height: 'auto',   
                        width: '300px',   
                    }} /> 
                    </center> 
                {happy.map((item) => {
                    const progress = Math.min(100, (item.interested / 100) * 100); 
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
                                   where: {item.address}
                                </Typography>
                                <Typography variant="h5" component="div">
                                  start time:  {item.start_time}
                                </Typography>
                                <Typography variant="h5" component="div">
                                  end time:  {item.end_time}
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
                                        People Going:
                                    </Typography>
                                    <LinearProgress variant="determinate" value={progress} />
                                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                                        <span>{item.interested} people interested</span>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        People Liked:
                                    </Typography>
                                    <LinearProgress variant="determinate" value={Math.min(100, (item.likes / 100) * 100)} />
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
            <UserNavBar  />
        </>
    );
};

export default HappyMapping;
