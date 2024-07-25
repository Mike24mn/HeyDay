import React, { useRef, useEffect, useState } from "react"; // Note to self, useRef allows for  a single render of the SAME content, meaning that its can PERSIST values between render events basically
import { Wrapper, Status } from "@googlemaps/react-wrapper"; // import google maps wrapper and status
import UserNavBar from "../UserNavBar/UserNavBar";
import Buttons from "../Buttons/Buttons";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector, useDispatch } from "react-redux";
// Note to self, useRef allows for  a single render of the SAME content, meaning that its can PERSIST values between render events basically
import L from "leaflet"; // importing leaflet as L, could import it as Leaflet too but this is easier
import "leaflet/dist/leaflet.css";
function UserLanding() {
  const dispatch = useDispatch();
  const googleMapRef = useRef(null);
  useEffect(() => {
    dispatch({ type: 'FETCH_HISTORY' });
  }, [dispatch]);


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
}
// duplicates from merging code can delete one of these (below or above here)
const renderStatus = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>;
    case Status.FAILURE:
      return <div>Failed to load the map</div>;
    default:
      return null;
  } }
  const GoogleMapComponent = ({ center, zoom, boundaries, currentLocation }) => {
    const mapRef = useRef(null);
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [map, setMap] = useState(null);
    const dispatch = useDispatch();
  
    const handleSearch = (place) => {
      console.log("handleSearch clicked", place.name);
      dispatch({ type: 'ADD_HISTORY', payload: { search_history: place.name } });
    };
  
    useEffect(() => {
      if (mapRef.current && !map) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapId: "2182bd31b6274e24",
        });
        setMap(mapInstance);
  
        if (inputRef.current) {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
          autocompleteRef.current.bindTo("bounds", mapInstance);
          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (!place.geometry || !place.geometry.location) {
              console.log("No details available for input: '" + place.name + "'");
              return;
            }
            if (place.geometry.viewport) {
              mapInstance.fitBounds(place.geometry.viewport);
            } else {
              mapInstance.setCenter(place.geometry.location);
              mapInstance.setZoom(17);
            }
            handleSearch(place);
            search21PlusPlaces(mapInstance, place.geometry.location);
          });
        }
      }
    }, [center, zoom, map]);
    useEffect(() => {
        if (map && currentLocation) {
          console.log("Updating map with current location:", currentLocation);
          map.setCenter(currentLocation);
          new window.google.maps.marker.AdvancedMarkerElement({
            position: currentLocation,
            map: map,
            title: "Your Location"
          });
        }
      }, [map, currentLocation]);
  const search21PlusPlaces = (mapInstance, location) => {
    const service = new window.google.maps.places.PlacesService(mapInstance);
    const request = {
      location,
      radius: "5000", // Radius in meters
      type: ["restaurant", "bar"], // Types of places to search
    };
    service.nearbySearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        results.forEach((place) => {
          if (place.geometry && place.geometry.location) {
            new window.google.maps.marker.AdvancedMarkerElement({
              position: place.geometry.location,
              map: mapInstance,
              title: place.name,
            });
          }
        });
      }
    });
}
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search Box"
        style={{
          boxSizing: "border-box",
          border: "1px solid transparent",
          width: "240px",
          height: "32px",
          marginTop: "27px",
          padding: "0 12px",
          borderRadius: "3px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          fontSize: "14px",
          outline: "none",
          textOverflow: "ellipsis",
          position: "absolute",
          top: "60px",
          left: "50%",
          marginLeft: "-120px",
          zIndex: 5,
        }}
      />
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};
const MapWrapper = () => {
    
    const [currentLocation, setCurrentLocation] = useState(null); // start with no user location 
    const user = useSelector((store) => store.user);
    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            console.log("in current location");
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error) => {
                setCurrentLocation(newLocation);
              console.error("Error retrieving location:", error);
            }
          );
        } else {
          alert("Geolocation not supported by this browser.");
        }
      };


  const boundaries = [
    [
      { lat: 32.5252, lng: -93.763504 },
      { lat: 32.5302, lng: -93.760504 },
      { lat: 32.5272, lng: -93.755504 },
      { lat: 32.5222, lng: -93.758504 },
    ],
    
    // Add more boundary needed
  ];
  return (
    <div>
    <center> <h2 style={{ textAlign: 'center', marginTop: '75px' }}>Welcome to Heyday, {user.username}!</h2></center> 
    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Button 
            variant="contained" 
            onClick={handleGetCurrentLocation}
            sx={{ 
              backgroundColor: "#057", 
              '&:hover': { 
                backgroundColor: "#046" 
              } 
            }}
          >
            Use Current Location
          </Button>
        </Box>
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places", "marker"]}
        render={renderStatus}
      >
        
        <GoogleMapComponent
          center={currentLocation || { lat: 32.5252, lng: -93.763504 }}
          zoom={15}
          boundaries={boundaries}
          currentLocation ={currentLocation}
          
        />
        
      </Wrapper>
      <Buttons />
      <UserNavBar />
    </div>
  );
};
return <MapWrapper />
}
export default UserLanding;
