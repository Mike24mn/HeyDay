
/*                                                                                                                    
 _ _ _       _                          _           _____            ____            
| | | | ___ | | ___  ___  _____  ___   | |_  ___   |  |  | ___  _ _ |    \  ___  _ _ 
| | | || -_|| ||  _|| . ||     || -_|  |  _|| . |  |     || -_|| | ||  |  || .'|| | |
|_____||___||_||___||___||_|_|_||___|  |_|  |___|  |__|__||___||_  ||____/ |__,||_  |
                                                               |___|            |___|          
*/
// move to readme ^^^
import React, { useRef, useEffect, useState } from "react"; // useRef for mutable vals or for things that shouldn't affect comp. rendering (aka can access and manipulate DOM directly basically)
import { Wrapper, Status } from "@googlemaps/react-wrapper"; // import wrapper, and status (used in the renderStatus function) method, for the Google API
import UserNavBar from "../UserNavBar/UserNavBar"; // import mui comp
import Buttons from "../Buttons/Buttons"; // import mui comp.
import Box from "@mui/material/Box"; // mui library import
import Button from "@mui/material/Button"; // mui library import 
import Typography from "@mui/material/Typography"; // mui library import
import LogOutButton from "../LogOutButton/LogOutButton"; // logout comp
import { useSelector, useDispatch } from "react-redux";
import L, { icon } from "leaflet"; // feel free to delete before client-hand off, we are not using this anymore
import "leaflet/dist/leaflet.css"; // feel free to delete before client-hand off, we are not using this anymore
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import './UserLanding.css'

/*
General notes and reminders for Heyday friends about the UserLanding function:
This is the core functionality of the App, as such, it is detailed with the utmost care
and precision for future developer reference and readability. Good documentation is a foundational
pillar of clean code and modular, reusable engineering standards that this Dev team is deeply committed to!
Cheers,
Team Heyday
*/
/*
Team Notes:
new keyword creates instances of a class
global scope window object in javascript represents browser window (allows us to manipulate map elements in a more dynamic/fluid fashion)
*/
function UserLanding() {
    const history = useHistory()
    const [showWelcome, setShowWelcome] = useState(false)

  // get the dispatch function to send the action to Redux
  const dispatch = useDispatch();
  const businesses = useSelector(state => state.business);

  useEffect(() => {
    console.log("Checking welcome message condition");
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    console.log("hasSeenWelcome:", hasSeenWelcome);
    if (hasSeenWelcome) {
      console.log("Setting showWelcome to true");
      setShowWelcome(true);
    //  localStorage.setItem('hasSeenWelcome', 'true');
      
      const timer = setTimeout(() => {
        console.log("Timer expired, setting showWelcome to false");
        setShowWelcome(false);
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, []);
  

  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  
  async function loadCityGeoJSON(cityName) {
    try {
      console.log("Attempting to fetch GeoJSON for:", cityName);
      const response = await fetch(`/mn/${cityName}.json`);
      if (!response.ok) {
        throw new Error('City data not found');
      }
      const data = await response.json();
      console.log("GeoJSON data loaded successfully");
      return data;
    } catch (error) {
      console.error('Error loading city data:', error);
      return null;
    }
  }
  // fetch history on component load (for search history)
  useEffect(() => {
    dispatch({ type: "FETCH_HISTORY" });
  }, [dispatch]);


  useEffect(() => {
    dispatch({ type: "FETCH_ALL_BUSINESSES" });
  }, [dispatch]);

  // this function uses methods to handle navigate different map loading statuses, if still loading the first div in
  // switch is shown, in the case of a failed load, return the second div, else return null
/**
 * 
 * @param {""} status 
 * @returns 
 */
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
  // component that renders the Google map; passed center object that has lat and lng
  // zoom, which is the zoom level based on a int value
  // boundaries for how we will draw polygons and perimeter outlines (still considering using a GeoJSON file alongside this)
  // currentLocation for the function handleGetcurrentLocation and our button that gets user location
  const GoogleMapComponent = ({ center, zoom, boundaries, currentLocation }) => {
    const mapRef = useRef(null);
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [map, setMap] = useState(null);
    const [cityBoundary, setCityBoundary] = useState(null);
    const [markers, setMarkers] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();
    const [userLocationCircle, setUserLocationCircle] = useState(null);


    function getCoordinates(businessAddress) {
        if (typeof businessAddress !== 'string') {
            console.error('Invalid address:', businessAddress);
            return Promise.resolve(null);
        }
    
        const geocoder = new google.maps.Geocoder();
        return new Promise((resolve, reject) => {
            geocoder.geocode({ address: businessAddress }, (results, status) => {
                if (status === 'OK') {
                    resolve({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    });
                } else {
                    console.error('Geocoding failed:', status);
                    resolve(null);
                }
            });
        });
    }
    // handleSearch is an arrow function that takes a place parameter
    // and adds the name (place.name) of it to the users history
    
    const handleSearch = (place) => {
      console.log("handleSearch clicked", place.name);
      dispatch({
        type: "ADD_HISTORY",
        payload: { search_history: place.name },
      });
    };

    const drawCityBoundary = (mapInstance, geoJSON) => {
        console.log("drawCityBoundary called with:", {mapInstance, geoJSON});
        if (mapInstance && geoJSON) {
          // Remove the previous boundary if it exists
          if (cityBoundary) {
            cityBoundary.setMap(null);
          }
      
          const boundary = new google.maps.Data();
          try {
            boundary.addGeoJson(geoJSON);
            console.log("GeoJSON added to boundary");
          } catch (error) {
            console.error("Error adding GeoJSON to boundary:", error);
            return;
          }
      
          boundary.setStyle({
            fillColor: "#ADD8E6",
            fillOpacity: 0.3,
            strokeColor: "#1E90FF",
            strokeOpacity: 0.8,
            strokeWeight: 5
          });
      
          boundary.setMap(mapInstance);
          setCityBoundary(boundary);
          console.log("Boundary set on map");
      
          const bounds = new google.maps.LatLngBounds();
          boundary.forEach((feature) => {
            console.log("Processing feature:", feature);
            const geometry = feature.getGeometry();
            if (geometry) {
              geometry.forEachLatLng((latLng) => {
                bounds.extend(latLng);
              });
            }
          });
          
          if (!bounds.isEmpty()) {
            mapInstance.fitBounds(bounds);
            console.log("Map bounds updated:", bounds.toString());
          } else {
            console.log("Bounds are empty");
          }
        } else {
          console.log("Map or GeoJSON data is missing", {mapInstance, geoJSON});
        }
      };
  
      const searchDatabasePlaces = async (mapInstance, searchLocation) => {
        try {
          const response = await fetch('/api/business');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const businesses = await response.json();
          console.log('Fetched businesses:', businesses);
    
          // Clear existing markers
          markers.forEach(marker => marker.setMap(null));
          setMarkers([]);
    
          const newMarkers = [];
          for (const business of businesses) {
            const coords = await getCoordinates(business.address);
            if (coords) {
              const icon = {
                url: '/public/icons8-map-pin-26.png',
                scaledSize: new google.maps.Size(30, 30),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 15)
              };
              const marker = new google.maps.Marker({
                position: coords,
                map: mapInstance,
                title: business.address,
                icon: icon
              });
    
              marker.addListener('click', () => {
                history.push(`/user-details/${business.id}`);
              });
    
              newMarkers.push(marker);
            }
          }
          setMarkers(newMarkers);
        } catch (error) {
          console.error('Error in searchDatabasePlaces:', error);
        }
      };
    
      useEffect(() => {
        if (mapRef.current && !map) {
          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 5,
            mapId: "2182bd31b6274e24",
          });
      
          setMap(mapInstance);
      
          if (inputRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
            autocompleteRef.current.bindTo("bounds", mapInstance);
      
            autocompleteRef.current.addListener("place_changed", async () => {
              const place = autocompleteRef.current.getPlace();
              console.log("Selected place:", place);
      
              if (!place.geometry || !place.geometry.location) {
                console.log("No geometry for place:", place);
                return;
              }
      
              // Remove the previous boundary if it exists
              if (cityBoundary) {
                cityBoundary.setMap(null);
                setCityBoundary(null);
              }
      
              if (place.types.includes('locality') && 
                  place.address_components.some(component => 
                    component.short_name === 'MN' && component.types.includes('administrative_area_level_1'))) {
                console.log("Minnesota city selected");
                const cityName = place.name.replace(/\s+/g, '_').toLowerCase();
                console.log("Fetching GeoJSON for:", cityName);
                const cityData = await loadCityGeoJSON(cityName);
                if (cityData) {
                  console.log("Calling drawCityBoundary with:", cityData);
                  drawCityBoundary(mapInstance, cityData);
                } else {
                  console.log("No GeoJSON data available for:", cityName);
                }
              } else {
                console.log("Non-Minnesota city or non-city place selected");
                if (place.geometry.viewport) {
                  console.log("Fitting to viewport");
                  mapInstance.fitBounds(place.geometry.viewport);
                } else {
                  console.log("Centering on location");
                  mapInstance.setCenter(place.geometry.location);
                  mapInstance.setZoom(17);
                }
              }
      
              // Search for businesses after a place is selected
              await searchDatabasePlaces(mapInstance, place.geometry.location);
      
              handleSearch(place);
              dispatch({ type: "FETCH_HISTORY" });
            });
          }
        }
      }, [center, zoom, boundaries, map, dispatch]);
  
    useEffect(() => {
      if (map && currentLocation) {
        console.log("Updating map with current location:", currentLocation);
        const iconHeart = {
          url: '/public/heartpin.png',
          scaledSize: new window.google.maps.Size(30, 30),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15)
        };
        new window.google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Your Location",
          icon: iconHeart
        });
        if (userLocationCircle) {
            userLocationCircle.setMap(null);
          }

          const circle = new window.google.maps.Circle({
            strokeColor: '#A9A9A9', 
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#D3D3D3', 
            fillOpacity: 0.3,    
            map: map,
            center: currentLocation,
            radius: 2000 
          });
      
          setUserLocationCircle(circle);
      
          map.setCenter(currentLocation);
          map.setZoom(15); 
        }
      }, [currentLocation, map]);
  
    return (
      <div style={{ height: "500px", width: "100%" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by city, address or state"
          style={{
            boxSizing: "border-box",
            border: "1px solid transparent",
            width: "240px",
            height: "32px",
            marginTop: "45px",
            padding: " 12px",
            borderRadius: "3px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            fontSize: "14px",
            outline: "none",
            textOverflow: "ellipsis",
            position: "absolute",
            top: "55px",
            left: "50%",
            marginLeft: "-120px",
            zIndex: 5,
          }}
        />
          <Box
            sx={{
              width: '90%',
              height: '70%',
              margin: '50px auto',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              
            }}
            ref={mapRef}
          ></Box>
      </div>
    );
  };
  // MapWrapper to set state info and handle general geolocation features, like getting current user location
  // we need this to ensure the button "Get Current Location"" works as intended
  const MapWrapper = () => {
    const [filteredData, setFilteredData] = useState([]);

    const handleFilterChange = (newFilteredData) => {
      setFilteredData(newFilteredData);
    };
    // getter and setter for currentLoc state management, init as null so location isn't a default given (maybe change this later?)
    const [currentLocation, setCurrentLocation] = useState(null);
    // select current logged in user from the redux store
    const user = useSelector((store) => store.user);

    const handleRandomButton = () => {
      if (businesses.length > 0) {
        const randomIndex = Math.floor(Math.random() * businesses.length);
        const randomBusiness = businesses[randomIndex];
        history.push(`/user-details/${randomBusiness.id}`);
      } else {
        console.log("No businesses available");
      }
    };

    // function that gets current users location
    const handleGetCurrentLocation = () => {
        // if location services are allowed by the browser (AKA a geolocation supported browser)
      if (navigator.geolocation) {
        // test via console log, delete later
        console.log("in current location");
        // Method that is part of the Google Geolocation API (wrappers ftw) 
        // it allows applications to get the location of devices (granted the support above is allowed via the browser)
        // Callback: after location is succesfully gathered, callback function below 
        // is given a position object with the users geographic position data
        // (the position object includes a bunch of misc. data, but we only want lat and lng)
        // this object contains latitude and longitude that we can use to set the state of 
        // a users current location via setCurrentLocation
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          // log any errors and what the error is
          (error) => {
            console.error("Error retrieving location:", error);
          }
        );
        // if browser doesn't support geoloc. detection, lets let the users know it!
      } else {
        alert("Geolocation not supported by this browser.");
      }
    };
    const boundaries = [
        // Boundary array for Minneapolis
    
      ];
      return (
        <div>
        {showWelcome && (
          <div
            className="welcome-message"
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '9999',
              color: '#fff',
              textAlign: 'center',
              padding: '20px',
              cursor: 'pointer',
            }}
            onClick={handleDismissWelcome}
          >
    <div className="welcome-message-content">
      <h2>Welcome to Heyday, {user.username}!</h2>
      <p>Click anywhere to dismiss</p>
    </div>
          </div>
        )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Button
             
              variant="contained"
              onClick={handleGetCurrentLocation}
              sx={{
                marginTop: "3px",
                backgroundColor: "#057",
                "&:hover": {
                  backgroundColor: "#046",
                },
              }}
            >
              Use Current Location
            </Button>
          </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
        <Button
        variant="contained"
        onClick={handleRandomButton}
        sx={{
          backgroundColor: "#057",
          "&:hover": {
            backgroundColor: "#046",
          },
          marginTop: "20px"
        }}
      >
        WildCard
      </Button>
      </Box>
          <Wrapper
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={["places", "marker"]}
            render={renderStatus}
          >
            <GoogleMapComponent
              center={currentLocation || { lat: 44.9778, lng: -93.2650 }}
              zoom={15}
              boundaries={boundaries}
              currentLocation={currentLocation}
              markers={filteredData}
            />
          </Wrapper>
          <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-135px', 
        }}
      >
        <Buttons onFilterChange={handleFilterChange} />
      </Box>
          <UserNavBar />
        </div>
      );
    };
  
    return (
      <div>
        <MapWrapper />
      </div>
    );
  }
  
export default UserLanding;
