import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
//import TheRippleEffect from '../TheRippleEffect/TheRippleEffect';

function LoginPage() {
  const history = useHistory();

  return (
    <div>
      <center></center>
      <LoginForm />
      

      <center>
        
        Dont have an account? <p></p>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/registration');
          }}
        >
          
          Signup
        </button>
        <p></p>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/user-landing-nonlogin');
          }}
        >
          
          Skip login
        </button>
        <p></p>
               <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/business-login');
          }}
        >
          
        
          Access Business Portal
        </button>
      </center>

      
    </div>
    
  );
}

export default LoginPage;
