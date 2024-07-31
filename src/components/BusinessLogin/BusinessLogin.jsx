import React, { useState, useEffect } from 'react'

import { useDispatch } from 'react-redux';
import {useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';


const LoginButtons = styled(Button)({
  backgroundColor: "#057",
  '&:hover': {
    backgroundColor: "#046",
  },
});

function BusinessLogin(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
  const user = useSelector(store => store.user); 
  const dispatch = useDispatch();
  const history = useHistory();


  useEffect(() => {
    // Redirect to user-landing page if user is logged in
    if (user) {
      history.push('/business-landing');
    }
}, [user]); // redirect only if user is changed/updated

  const login = (event) => {
    event.preventDefault();


    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login


  return (

    <div>
        <h>You are on business Login</h>
          <TheRippleEffect/>
      <LoginForm />
      BusinessLogin
    </div>


    
     
  );
}

export default BusinessLogin;
