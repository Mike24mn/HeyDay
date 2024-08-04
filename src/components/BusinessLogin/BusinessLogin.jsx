import React from "react";
import BusinessLoginForm from "../BusinessLoginForm/BusinessLoginForm";
import TheRippleEffect from "../TheRippleEffect/TheRippleEffect";

const BusinessLogin = ()=>{
  return (
    <form className="formPanel" onSubmit={login}>
      <center><h2>Login</h2></center> 
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
      )}
      <div>
        <center><label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            required
            value={username}
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
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label></center>
      </div>
  

    <div>
        <h>You are on business Login</h>
          <TheRippleEffect/>
      <BusinessLoginForm />
      BusinessLogin
    </div>


    
  );
}

export default BusinessLogin;

