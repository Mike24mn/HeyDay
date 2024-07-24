import React from 'react';
import UserNavBar from '../UserNavBar/UserNavBar';
import { useSelector } from "react-redux";

function UserSearchHistory() {
  const searchHistory = useSelector((store) => store.historyReducer);

  return (
    <div>
      <h2>Search History List</h2>
      <div>
        {searchHistory.map((item) => (
          <div key={item.id}>
            <p> {item.search_history}</p>
          </div>
        ))}
      </div>
      <center><UserNavBar /></center>
    </div>
  );
}

export default UserSearchHistory;
