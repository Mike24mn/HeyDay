
import React, { useRef, useEffect, useState } from "react"; // Note to self, useRef allows for  a single render of the SAME content, meaning that its can PERSIST values between render events basically
import { Wrapper, Status } from "@googlemaps/react-wrapper"; // import google maps wrapper and status
import UserNavBar from "../UserNavBar/UserNavBar";
import Buttons from "../Buttons/Buttons";
import { Button } from "bootstrap";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector, useDispatch } from "react-redux";
// Note to self, useRef allows for  a single render of the SAME content, meaning that its can PERSIST values between render events basically
import L from "leaflet"; // importing leaflet as L, could import it as Leaflet too but this is easier
import "leaflet/dist/leaflet.css";

function UserLanding() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(""); 
  const googleMapRef = useRef(null);

  useEffect(() => {
    dispatch({ type: 'FETCH_HISTORY' });
  }, [dispatch]);

  function handleSearch() {
    console.log("handleSearch clicked");
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
}

const renderStatus = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>;
    case Status.FAILURE:
      return <div>Failed to load the map</div>;
    default:
      return null;
  }
};
const GoogleMapComponent = ({ center, zoom, boundaries, currentLocation }) => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [map, setMap] = useState(null);


  useEffect(() => {
    if (currentLocation && map) {
      new window.google.maps.Marker({
        position: currentLocation,
        map: map,
      });
      map.setCenter(currentLocation); // Center the map to the current location
    }
  }, [currentLocation, map]); // Effect depends on currentLocation, update on change of either of these
  
  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: "2182bd31b6274e24",
      });
      setMap(mapInstance);
      boundaries.forEach((boundary) => {
        const polygon = new window.google.maps.Polygon({
          paths: boundary,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });
        polygon.setMap(mapInstance);
        polygon.addListener("click", () => {
          alert("Polygon clicked!");
        });
      });
      if (inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current
        );
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
          search21PlusPlaces(mapInstance, place.geometry.location);
        });
      }
    }
  }, [center, zoom, boundaries]);
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
          top: "10px",
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
              console.error("Error retrieving location:", error);
            }
          );
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      };
  const user = useSelector((store) => store.user);
  const boundaries = [
    [
      { lat: 32.5252, lng: -93.763504 },
      { lat: 32.5302, lng: -93.760504 },
      { lat: 32.5272, lng: -93.755504 },
      { lat: 32.5222, lng: -93.758504 },
    ],
    
    // Add more boundary arrays as needed
  ];
  return (
    <div>
    <center> <h2>Welcome to Heyday, {user.username}!</h2></center> 
      <center>
        <button onClick={handleGetCurrentLocation}>Get Current Location</button>
      </center>

      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places", "marker"]}
        render={renderStatus}
      >
        <form onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
        }}
        >
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
      </form>
        
        <GoogleMapComponent
          center={{ lat: 32.5252, lng: -93.763504 }}
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
