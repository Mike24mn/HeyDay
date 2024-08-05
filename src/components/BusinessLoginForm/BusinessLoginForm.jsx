import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import "./BusinessLoginForm.css";

const LoginButton = styled(Button)({
  backgroundColor: "#057",
  "&:hover": {
    backgroundColor: "#046",
  },
});

function BusinessLoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errors = useSelector((store) => store.errors);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const history = useHistory();

  // I feel like an access_level check may be necesarry here or put in the
  // dependency array

  useEffect(() => {
    // Redirect to business-landing page if user is logged in
    if (user) {
      history.push("/business-landing");
    }
  }, [user]); // redirect only if user is changed/updated

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: "LOGIN_BUSINESS",
        payload: {
          username: username,
          password: password,
          isBusiness: true,
        },
      });
    } else {
      dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
  }; // end login

  return (
    <form className="formPanel" onSubmit={login}>
      <center>
        <h2 className="buslog">Login</h2>
      </center>
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
      )}
      <div>
        <center>
          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              required
              value={username}
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
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </center>
      </div>
      <div>
        <center>
          <LoginButton type="submit" variant="contained" className="btn">
            Log In
          </LoginButton>
        </center>
      </div>
    </form>
  );
}

export default BusinessLoginForm;
