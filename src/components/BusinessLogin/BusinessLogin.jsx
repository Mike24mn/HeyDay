import React, { useState } from "react";
import BusinessLoginForm from "../BusinessLoginForm/BusinessLoginForm";
import TheRippleEffect from "../TheRippleEffect/TheRippleEffect";

const BusinessLogin = ({ login, errors }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    login({ username, password });
  };

  return (
    <form className="formPanel" onSubmit={handleSubmit}>
      <center><h2>Login</h2></center>
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
        <h3>You are on business Login</h3>
        <TheRippleEffect />
        <BusinessLoginForm />
      </div>
    </form>
  );
};

export default BusinessLogin;
