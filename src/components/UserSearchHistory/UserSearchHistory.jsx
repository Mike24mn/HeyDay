import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserNavBar from '../UserNavBar/UserNavBar';
import { useSelector, useDispatch } from "react-redux";
import Box from '@mui/material/Box';

function UserSearchHistory() {
  const searchHistory = useSelector((store) => store.historyReducer);
  console.log("checking history", searchHistory);
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_HISTORY' });
  }, [dispatch]);

  const handleDelete = (itemId) => {
    dispatch({ type: 'DELETE_ITEM', payload: itemId });
  };

  const filteredHistory = searchHistory.filter(
    (his) => Number(his.user_id) === Number(user.id)
  );
  console.log("checking his filt", filteredHistory);

  return (
    <div>
      <center><h2>DO YOU REMEMBER THIS PLACE?</h2></center>
      <div>
        {filteredHistory.map((item) => (
        <center>  <Box 
            key={item.id}
            sx={{ 
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'dodgerblue',
              padding: '10px',
              borderRadius: '5px',
              width: '50%', // Takes up half the width of the container
              boxSizing: 'border-box' // Ensures padding and border are included in the element's total width and height
            }}
          >
            <div>
              {item.business_id ? (
                <Link to={`/user-details/${item.business_id}`}>
                  <span style={{ color: 'white' }}>{item.name}</span>
                </Link>
              ) : (
                <span style={{ color: 'white' }}>{item.address}</span>
              )}
              {item.address && <span style={{ color: 'white' }}> - {item.address}</span>}
            </div>
            <button onClick={() => handleDelete(item.id)} style={{ color: 'white' }}>❌</button>
          </Box> </center>
        ))}
      </div>
      <center><UserNavBar /></center>
    </div>
  );
}

export default UserSearchHistory;
