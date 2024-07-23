import React from "react";
import UserNavBar from "../UserNavBar/UserNavBar";
import Buttons from "../Buttons/Buttons";
import { Button } from "bootstrap";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react"; // Note to self, useRef allows for  a single render of the SAME content, meaning that its can PERSIST values between render events basically
import L from "leaflet"; // importing leaflet as L, could import it as Leaflet too but this is easier
import "leaflet/dist/leaflet.css";

import { Wrapper, Status } from "@googlemaps/react-wrapper"; // google wrapper

function UserLanding() {
  const user = useSelector((store) => store.user);


  const googleMapRef = useRef(null);

  

  function GoogMap() {
    useEffect(() => {
      if (googleMapRef.current) {
        new window.google.maps.Map(googleMapRef.current, {
          center: { lat: 32.5252, lng: -93.763504 },
          zoom: 15,
        });
      }
    }, []); // dependency arry, only run when first mounted since its empty, remember we can force rerenders here by providing a variable within the array, when the variable changes, a rerender would be triggered

    return (
      <div ref={googleMapRef} style={{ height: "500px", width: "100%" }}></div>
    );
  }

  const renderGoogleMap = (status) => {
    switch (status) {
      case Status.LOADING:
        return <div>Loading goog map...</div>;
      case Status.FAILURE:
        return <div>Error goog map</div>;
      case Status.SUCCESS:
        return <GoogMap />;
    }
  };

  return (
    <div>
      <h2>Welcome to Heyday, {user.username}!</h2>
      <div>

        {/* Heyday team mates, Check the .env file and make sure you have a VITE_GOOGLE_MAPS_API_KEY variable and Google API key if you want to test with this map */}
        <Wrapper
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          render={renderGoogleMap}
        />
      </div>
      <Buttons />
      <center>
        <UserNavBar />
      </center>
    </div>
  );
}

export default UserLanding;
