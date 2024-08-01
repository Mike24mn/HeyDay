import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserNavBar from "../UserNavBar/UserNavBar";
import './UserFavoriteLocations.css';

function UserFavoriteLocations() {
  const user = useSelector((store) => store.user);
  const favorite = useSelector((store) => store.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.id) {
      dispatch({ type: "SET_FAVS", payload: user.id });
    }
  }, [dispatch, user]);

  const filteredFavs = favorite.filter(
    (fav) => Number(fav.user_id) === Number(user.id)
  );

  const handleDel = (id) => {
    dispatch({ type: "DELETE_FAVS", payload: { id } });
  };

  return (
    <div className="favorite-locations-container">
   
      <h1 className="title">User Favorite Locations</h1>
      <h2 className="welcome">Welcome, {user.username}!</h2>
      {filteredFavs.length > 0 ? (
        <div className="favorites-list">
          {filteredFavs.map((fav, index) => (
            <div key={index} className="favorite-card">
              <h3>{fav.name}</h3>
              <p><strong>Address:</strong> {fav.address}</p>
              <button 
                className="delete-button" 
                onClick={() => handleDel(fav.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorite locations found.</p>
      )}
          <UserNavBar />
    </div>
  );
}

export default UserFavoriteLocations;
