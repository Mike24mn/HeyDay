import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserNavBar from '../UserNavBar/UserNavBar';
import { useSelector, useDispatch } from "react-redux";

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
          <div key={item.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {item.business_id ? (
                <Link to={`/user-details/${item.business_id}`}>
                  <span>{item.search_history}</span>
                </Link>
              ) : (
                <span>{item.search_history}</span>
              )}
              {item.address && <span> - {item.address}</span>}
            </div>
            <button onClick={() => handleDelete(item.id)}>❌</button>
          </div>
        ))}
      </div>
      <center><UserNavBar /></center>
    </div>
  );
}

export default UserSearchHistory;