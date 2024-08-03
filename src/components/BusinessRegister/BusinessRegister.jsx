import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

function BusinessRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const registerUser = async (event) => {
    event.preventDefault();
  
    try {
      await dispatch({
        type: 'REGISTER',
        payload: {
          username: username,
          password: password,
        },
      });
  
      const targetPath = '/businessinfo';
      console.log('Current path:', history.location.pathname);
      console.log('Redirecting to:', targetPath);
  
      if (history.location.pathname !== targetPath) {
        history.replace(targetPath); // or history.push(targetPath);
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <form className="formPanel" onSubmit={registerUser}>
      <center><h2>Register User</h2></center>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <div>
        <center>
          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              value={username}
              required
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
        </center>
      </div>
      <div>
        <center>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </center>
      </div>
      <div>
        <center>
          <input className="btn" type="submit" name="submit" value="Register" />
        </center>
      </div>
    </form>
  );
}

export default BusinessRegister;
