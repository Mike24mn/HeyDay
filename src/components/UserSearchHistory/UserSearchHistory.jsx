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
          <div key={item.id} style={{ marginBottom: '10px' }}>
            <span>{item.search_history}</span>
            {item.address && <span> - {item.address}</span>}
            <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px' }}>❌</button>
          </div>
        ))}
      </div>
      <center><UserNavBar /></center>
    </div>
  );
}

export default UserSearchHistory;
