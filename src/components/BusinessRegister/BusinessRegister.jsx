import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import TheRippleEffect from '../TheRippleEffect/TheRippleEffect'; // Assuming you want to keep this
import TheRippleBusiness from '../TheRippleBusiness/TheRippleBusiness';
import Buttons from '../Buttons/Buttons';




function BusinessRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
      },
    });
    history.push("/businessinfo");
  }; 

  return (
    <div>
      <TheRippleBusiness />
      <form className="formPanel" onSubmit={registerUser}>
        <center><h2>Register Business</h2></center>
        {errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {errors.registrationMessage}
          </h3>
        )}
        <div>
          <center><label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              value={username}
              required
              onChange={(event) => setUsername(event.target.value)}
            />
          </label></center>
        </div>
        <div>
         <center><label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </label></center>
        </div>
        <div>
          <center><input className="btn" type="submit" name="submit" value="Register" /></center>
        </div>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          <Link to="/business-login" >Back to Business Login</Link>
        </p>
        <p>
          <Link to="/login" >Back to User Portal</Link>
        </p>
      </div>
    </div>
  );
}


export default BusinessRegister;