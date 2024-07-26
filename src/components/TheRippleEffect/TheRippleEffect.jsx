
import React from 'react';
import './TheRippleEffect.css';
import logo from '/image copy.png'

function TheRippleEffect() {
  return (
    <div className="loader-container">
      <img src={logo} className="logo" />
      <div className="ripple"></div>
    </div>
  );
}

export default TheRippleEffect;

