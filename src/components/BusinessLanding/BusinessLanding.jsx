import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import BusinessNavBar from '../BusinessNavBar/BusinessNavBar';

const LoginButton = styled(Button)({
  backgroundColor: "#057",
  '&:hover': {
    backgroundColor: "#046",
  },
});

const InputContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '20px',
});

function BusinessLanding() {
  const [getHappy, setHappy] = useState('');
  const [getAddress, setAddress] = useState('');
  const [getName, setName] = useState('');
  const [happyHourTime, setHappyHourTime] = useState(''); 
  const [happyHourDate, setHappyHourDate] = useState('');

  const business = useSelector(store => store.business);
  const user = useSelector(store => store.user);
  const happy = useSelector(store => store.happy);
  
  const dispatch = useDispatch();

  const busFilter = (business || []).filter(bus => bus && bus.business_id && Number(bus.business_id) === Number(user.id));
  const happyFilter = (happy || []).filter(hap => hap && hap.business_id && Number(hap.business_id) === Number(user.id));
 
  useEffect(() => {
    dispatch({ type: "SET_BUS" });
    dispatch({ type: "SET_HAPPY" });
  }, [dispatch]);

  const handleHappy = (event) => {
    event.preventDefault();

    if (busFilter.length > 0) {
      const businessId = busFilter[0].business_id;
      
      dispatch({
        type: 'ADD_HAPPY',
        payload: {
          business_id: businessId,
          happyName: getName,
          address: getAddress,
          description: getHappy,
          date: happyHourDate,
          time: happyHourTime,
        }
      });

      dispatch({ type: 'SET_HAPPY' });

      setHappy('');
      setName('');
      setAddress('');
      setHappyHourTime(''); 
      setHappyHourDate(''); 
    }
  }

  const handleDel = (id) => {
    dispatch({ type: "DELETE_HAPPY", payload: { id } });
    dispatch({ type: 'SET_HAPPY' });
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  }

  return (
    <>
      <div>
        <center>
          <h1>Welcome {user.username}</h1>
        </center>
        <h2>
          {busFilter.map((bus) => (
            <p key={bus.id}>
              <center>{bus.business_name}</center>
            </p>
          ))}
        </h2>
        <InputContainer>
          <input
            type="text"
            value={getName}
            onChange={(event) => setName(event.target.value)}
            placeholder='Happy Hour Name'
          />
          <input
            type="text"
            value={getAddress}
            onChange={(event) => setAddress(event.target.value)}
            placeholder='Address of Happy Hour'
          />
          <input
            type="text"
            value={getHappy}
            onChange={(event) => setHappy(event.target.value)}
            placeholder="Enter description"
          />
          <input
            type="date"
            value={happyHourDate}
            onChange={(event) => setHappyHourDate(event.target.value)}
            placeholder="Enter date"
          />
          <input
            type="time"
            value={happyHourTime}
            onChange={(event) => setHappyHourTime(event.target.value)}
            placeholder="Enter time"
          />
          <LoginButton onClick={handleHappy}>SUBMIT</LoginButton>
        </InputContainer>
     
      </div>

      <Grid container spacing={4} justifyContent="center">
        {happyFilter.map((hap) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={hap.id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                sx={{ height: 200 }}
                image="public/image.png"
                title={hap.happyName}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {hap.happyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description: {hap.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {formatDate(hap.date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time: {hap.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {hap.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  likes: {hap.likes}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleDel(hap.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <footer>
          <BusinessNavBar />
        </footer>
    </>
  );
}

export default BusinessLanding;
