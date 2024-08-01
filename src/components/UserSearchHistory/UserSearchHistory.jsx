import React, { useEffect } from 'react';
import UserNavBar from '../UserNavBar/UserNavBar';
import { useSelector,useDispatch } from "react-redux";



function UserSearchHistory() {
  const searchHistory = useSelector((store) => store.historyReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'FETCH_HISTORY' });
  }, [dispatch]);

  
  const handleDelete = (itemId) => {
    dispatch({ type: 'DELETE_ITEM', payload: itemId });
  };

  return (
    <div>
      <h2>Search History List</h2>
      <div>
        {searchHistory.map((item) => (
          <div key={item.id}>
            <p> {item.search_history}    <button  onClick={() => handleDelete(item.id)}>❌</button> </p>
          
          </div>
        ))}
      </div>
      <center><UserNavBar /></center>
    </div>
  );
}

export default UserSearchHistory;
