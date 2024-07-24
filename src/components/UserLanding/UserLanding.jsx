import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import UserNavBar from "../UserNavBar/UserNavBar";
import Buttons from "../Buttons/Buttons";

function UserLanding() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(""); 
  const googleMapRef = useRef(null);

  useEffect(() => {
    dispatch({ type: 'FETCH_HISTORY' });
  }, [dispatch]);

  function handleSearch() {
    dispatch({ type: 'ADD_HISTORY', payload: { search_history: searchTerm } });
    setSearchTerm(''); 
  }


  function GoogMap() {
    useEffect(() => {
      if (googleMapRef.current) {
        new window.google.maps.Map(googleMapRef.current, {
          center: { lat: 32.5252, lng: -93.763504 },
          zoom: 15,
        });
      }
    }, []);

    return <div ref={googleMapRef} style={{ height: "500px", width: "100%" }}></div>;
  }

  const renderGoogleMap = (status) => {
    switch (status) {
      case Status.LOADING:
        return <div>Loading Google map...</div>;
      case Status.FAILURE:
        return <div>Error loading Google map</div>;
      case Status.SUCCESS:
        return <GoogMap />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>Welcome to Heyday, {user.username}!</h2>
      <div>
        {/* Ensure you have a valid Google Maps API key */}
        <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} render={renderGoogleMap} />
      </div>
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleSearch} style={{ padding: "5px 10px" }}>
          Search
        </button>
      </div>
      <Buttons />
      <center>
        <UserNavBar />
      </center>
    </div>
  );
}

export default UserLanding;
