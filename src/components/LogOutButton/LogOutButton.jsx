import React from 'react';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';

const LogoutButton = styled(Button)({
  backgroundColor: "#057",
  '&:hover': {
    backgroundColor: "#046",
  },
});

function LogOutButton(props) {
  
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    history.push('/login'); 
  };

  return (
    <LogoutButton
      variant="contained"
      className={props.className}
      onClick={handleLogout}
    >
      Log Out
    </LogoutButton>
  );
}

export default LogOutButton;



