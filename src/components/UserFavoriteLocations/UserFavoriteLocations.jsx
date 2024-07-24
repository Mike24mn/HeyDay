import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import UserNavBar from "../UserNavBar/UserNavBar";

function UserFavoriteLocations() {
  const user = useSelector((store) => store.user);
  const favorite = useSelector((store) => store.favorites);
  console.log("checking fav", favorite);

  const dispatch = useDispatch();

  console.log("User:", user);
  console.log("Favorites:", favorite);

  useEffect(() => {
    if (user && user.id) {
      dispatch({ type: "SET_FAVS", payload: user.id });
    }
  }, [dispatch, user]);

  const id = user.id;

  const filteredFavs = favorite.filter(
    (fav) => Number(fav.user_id) === Number(user.id)
  );

  console.log("Filtered Favorites:", filteredFavs);

  const handleDel = (id) =>{
    dispatch({ type:"DELETE_FAVS", payload: {id} })
    console.log("checking id in delete handle ", id );


  }

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
              <button onClick={()=>handleDel(fav.id)} >DELETE </button>
            </li>
           
          ))}
        </ul>
      ) : (
        <p>No favorite locations found.</p>
      )}
      <UserNavBar/>
    </div>
  );
}
export default UserFavoriteLocations;
