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
  const [happyEndTime, setHappyEndTime] = useState('');
  const [happyHourDate, setHappyHourDate] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState('');

  const business = useSelector(store => store.business);
  const user = useSelector(store => store.user);
  const happy = useSelector(store => store.happy);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SET_BUS" });
    dispatch({ type: "SET_HAPPY" });
  }, [dispatch]);


  const busFilter = (business || []).filter(bus => bus && bus.user_id && Number(bus.user_id) === Number(user.id));
  const happyFilter = (happy || []).filter(hap => hap && hap.user_id && Number(hap.user_id) === Number(user.id));

  const handleHappy = (event) => {
    event.preventDefault();

    if (!selectedBusinessId) {
      console.error('No business selected');
      return;
    }

    console.log("Selected Business ID: ", selectedBusinessId);

    dispatch({
      type: 'ADD_HAPPY',
      payload: {
        user_id: user.id,
        business_id: selectedBusinessId,
        address: getAddress,
        description: getHappy,
        date: happyHourDate,
        start_time: happyHourTime,
        end_time: happyEndTime,
        name: getName,
      },
    });

    dispatch({ type: 'SET_HAPPY' });

    setHappy('');
    setName('');
    setAddress('');
    setHappyHourTime('');
    setHappyHourDate('');
    setHappyEndTime('');
    setSelectedBusinessId('');
  };

  const handleDel = (id) => {
    dispatch({ type: "DELETE_HAPPY", payload: { id } });
    dispatch({ type: 'SET_HAPPY' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

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
          <select
            value={selectedBusinessId}
            onChange={(event) => setSelectedBusinessId(event.target.value)}
          >
            <option value="" disabled>Select Business</option>
            {busFilter.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.business_name}
              </option>
            ))}
          </select>
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
            placeholder="start time"
          />
          <input
            type="time"
            value={happyEndTime}
            onChange={(event) => setHappyEndTime(event.target.value)}
            placeholder="End time"
          />
          <LoginButton onClick={handleHappy}>SUBMIT</LoginButton>
        </InputContainer>
      </div>

  
    </div>
   

      <Grid container spacing={4} justifyContent="center">
        {happyFilter.map((hap) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={hap.id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                sx={{ height: 200 }}
                image="public/image.png"
                title={hap.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {hap.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description: {hap.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {formatDate(hap.date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start Time: {hap.start_time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End Time: {hap.end_time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {hap.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Likes: {hap.likes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  People Interested: {hap.interested}
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
