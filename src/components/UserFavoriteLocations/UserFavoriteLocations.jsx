import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
function UserFavoriteLocations() {
  const user = useSelector(store => store.user);
  const favorite = useSelector(store => store.favorites);
  console.log("checking fav", favorite);
  const dispatch = useDispatch()
 
  console.log("User:", user);
  console.log("Favorites:", favorite);
  useEffect(() => {
    if (user && user.id) {
      dispatch({ type: "SET_FAVS", payload: user.id });
    }
  }, [dispatch, user]);
  const id = user.id;
  
  const filteredFavs = favorite.filter(fav => Number(fav.user_id) === Number(user.id));
  console.log("Filtered Favorites:", filteredFavs);
  return (
    <div>
      <h1>User Favorite Locations</h1>
      <h1>{user.username}</h1>
      {filteredFavs.length > 0 ? (
        <ul>
          {filteredFavs.map((fav, index) => (
            <li key={index}>
              <p>{fav.name}</p> 
              <p>ADDRESS:{fav.address}</p>
              </li> 
          ))}
        </ul>
      ) : (
        <p>No favorite locations found.</p>
      )}
    </div>
  );
}
export default UserFavoriteLocations;