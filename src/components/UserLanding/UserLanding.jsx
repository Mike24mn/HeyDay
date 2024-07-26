/*                                                                                                                    
 _ _ _       _                          _           _____            ____            
| | | | ___ | | ___  ___  _____  ___   | |_  ___   |  |  | ___  _ _ |    \  ___  _ _ 
| | | || -_|| ||  _|| . ||     || -_|  |  _|| . |  |     || -_|| | ||  |  || .'|| | |
|_____||___||_||___||___||_|_|_||___|  |_|  |___|  |__|__||___||_  ||____/ |__,||_  |
                                                               |___|            |___|          
*/

import React, { useRef, useEffect, useState } from "react"; // useRef for mutable vals or for things that shouldn't affect comp. rendering (aka can access and manipulate DOM directly basically)
import { Wrapper, Status } from "@googlemaps/react-wrapper"; // import wrapper, and status (used in the renderStatus function) method, for the Google API
import UserNavBar from "../UserNavBar/UserNavBar"; // import mui comp
import Buttons from "../Buttons/Buttons"; // import mui comp.
import Box from "@mui/material/Box"; // mui library import
import Button from "@mui/material/Button"; // mui library import 
import Typography from "@mui/material/Typography"; // mui library import
import LogOutButton from "../LogOutButton/LogOutButton"; // logout comp
import { useSelector, useDispatch } from "react-redux";
import L from "leaflet"; // feel free to delete before client-hand off, we are not using this anymore
import "leaflet/dist/leaflet.css"; // feel free to delete before client-hand off, we are not using this anymore


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

  // get the dispatch function to send actions to Redux
  const dispatch = useDispatch();

  // fetch history on component load (for search history)
  useEffect(() => {
    dispatch({ type: "FETCH_HISTORY" });
  }, [dispatch]);

  // this function uses methods to handle navigate different map loading statuses, if still loading the first div in
  // switch is shown, in the case of a failed load, return the second div, else return null

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

    const mapRef = useRef(null);   // initialize null, then reference the location on the DOM we want to render the map to ultimately
    // this makes it so the map is only made after the DOM is created and available
    // also persists between renders, which is a huge plus for resource allocation/potential load time problems

    const inputRef = useRef(null); // similar logic, but for our search input box

    const autocompleteRef = useRef(null); // similar logic, but for autocomplete functionality

    const [map, setMap] = useState(null); // getter and setter for storing out map instance
    const dispatch = useDispatch();

    // handleSearch is an arrow function that takes a place parameter
    // and adds the name (place.name) of it to the users history

    const handleSearch = (place) => {
      console.log("handleSearch clicked", place.name);
      dispatch({
        type: "ADD_HISTORY",
        payload: { search_history: place.name },
      });
    };

    // init map and auto complete 

    useEffect(() => {

        // If condition below: does our map reference have a value? is map state getter null or undefined?
        // if so the DOM is ready and we can create an instance of the map, since one
        // does not currently exist (!map)

        // create a (new) instance of the map at the mapRef location on the DOM (located within the return below)
        // center gives map lat and lng coordinates
        // zoom = zoom level (an int value)
        // mapId is a Google developer portal value that is loosely tied to your dev profile and API key (no need for security concerns/.env inclusion; its primary purpose is for identity and styling)

      if (mapRef.current && !map) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapId: "2182bd31b6274e24",
        });

        setMap(mapInstance); // set mapInstance created above in comp state

        // draw boundaries for each boundary (simple lat. long. points) and make them polyganol shaped

        // we gotta somehow make this dynamic, I think if we add a function that
        // detects boundaries coordinates and then call it here could make it so
        // a polygon is rendered at each location we type in the search bar???
        // store it to state and then have it delete and rerender new ones too
        // so we are not storing the old polygons on the map (dependency array style maybe?)

        boundaries.forEach((boundary) => {

            // make new polygon instances 

          const polygon = new window.google.maps.Polygon({
            paths: boundary,
            strokeColor: "#8A2BE2", // outline perimeter stroke color
            strokeOpacity: 0.8, // transparency essentially, but as it relates to another layer
            strokeWeight: 5, // line weighting
            fillColor: "#ADD8E6", // inner polgyon color
            fillOpacity: 0.35, // fill color transparency
          });

          // weave it into the current set instance of the map

          polygon.setMap(mapInstance);

          // add listener to the polygon, so we can detect interaction
          // with the polygon, I added this in case we want to manipulate the polygon eventually
          // or make it malleable and adjustable

          polygon.addListener("click", () => {

            // give this alert when interacting

            alert("Polygon clicked!");
          });
        });

        /*
        Heyday Notes on API resources:

        We need Find Place, Nearby Search, Text Search, Place Details, 
        Place Photo, Place Autocomplete and Query Autocomplete I believe.
        I am thinking a switch/ternary that responds to certain text input?
        like Google has where you can type in "bars" and it searches generally 
        but also gives results based on queries that have the word "bar" in the title

        Idk, we gotta brainstorm this more
        */

        // init autocomplete for search box (need to adjust this to include ALL Places API resources)
        
        // If logic: does our input field have a value in it? If so, proceed
        if (inputRef.current) {

        // create an instance of Google Autocomplete class based on current input values/characters

          autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);

        // only search current boundary bounds on the current mapInstance

          autocompleteRef.current.bindTo("bounds", mapInstance);

        // listener to handle event when a place is actually selected

          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();

        // check for geographic information first before proceeding

            if (!place.geometry || !place.geometry.location) {

            // tell user there is no info for that place, its probably invalid

              console.log("No details available for input: '" + place.name);
              return;
            }

            // if place has a viewport prop, and map can zoom and pan to fit it,
            // then do so via fitBounds (fitBounds basicaly adjusts the maps view to include entire viewport area)

            if (place.geometry.viewport) {
              mapInstance.fitBounds(place.geometry.viewport);
            } 
            
            else {

              // center map at the location of the place
              mapInstance.setCenter(place.geometry.location)
              // setZoom at int level 17
              mapInstance.setZoom(17);

            }

            // call handleSearch and pass it the place from autocompletes suggested completion
            handleSearch(place);

            // take map instance and loc. coordinates and search places near it with the totally tubular searchPlaces function
            searchPlaces(mapInstance, place.geometry.location);

            // dispatch an action to the Redux store fetching updated search history
            // and updating the store with the latest search!
            dispatch({ type: "FETCH_HISTORY" });
          });
        }
      }
    }, [center, zoom, boundaries, map, dispatch]); // dependency array, AKA update whenever any of these things change
    // this is the "meat" of our app, and it needs to stay in sync and updated with changes and user interactions
    // eventually we will need to consider useMemo logic implementations to reduce laggy load times
    // useMemo could probably work great when we start selecting all combinations of Vibe, Diet and Time
    // and isolating pins based on those criteria


    // update w/ the current location if map present and currentLocation
    // remember currentLocation (used in a button below) is what finds the users current location!

    useEffect(() => {

      if (map && currentLocation) {

        // log it so we know where currentLoc is going in dev tools
        console.log("Updating map with current location:", currentLocation);

        // put a marker there via the Google class,
        // we will want to customize this later, remember she wants purple icon pins
        // for general locations BUT the special Heyday heart pin for user loc. 
        new window.google.maps.marker.AdvancedMarkerElement({
          position: currentLocation, // put marker at current loc.
          map: map, // on the current map
          title: "Your Location", // title it, so user knows what it is
        });
        map.setCenter(currentLocation); // set center of the map at current user location

        searchPlaces(map, currentLocation); // search nearby places, on the map, given users current location
      }
    }, [currentLocation, map]); // Update on a new current location, or if a new map is created/instantiated


    // Arrow function to searchPlace in the vicinity (i.e, a radius of 5000 meters)
    // it takes the map instance and location as parameters

    const searchPlaces = (mapInstance, location) => {

        // create new instance of the Places API Service class given the current
        // map instance and name it service
      const service = new window.google.maps.places.PlacesService(mapInstance);

      // create a request object for the search of nearby services and places
      // this is based on the location that is passed to searchPlaces above,
      // and uses a radius range of 5000 meters to that location
      // and only searches for the type or establishments listed in type (bars and restaurants here, change if needed)
      const request = {
        location,
        radius: "5000",
        type: ["restaurant", "bar"],
      };
      
      // Callback function below:
      // do a search using the PlacesService when "service.nearbySearch..."" is called
      // then take the results and status of the search and proceed to the 
      // code block within Example: {<code block contents here>} is ran (invoked)
      // with the results and status, results will be an array of objects found in the search
      // status is simply the code telling us if its succesful or not (this makes sure results array is not emtpy!)

      service.nearbySearch(request, (results, status) => {

        // If search success and results contains something, 
        // then lets process each place in the results array of objects
        // and make sure it has valid coordinate info (geometry && place.geometry.location) 
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            // loop through each results place
          results.forEach((place) => {
            if (place.geometry && place.geometry.location) {
                // put a new marker at each (NOTE: this will eventually be the purple markers for our client)
              new window.google.maps.marker.AdvancedMarkerElement({
                position: place.geometry.location, // where we put the marker
                map: mapInstance, // on what instance of map we put the marker
                title: place.name, // access each places name for the title
              });
            }
          });
        }
      });
    };


    // This is the return (and styling) for our search box, given via ref=(inputRef) 
    // and in a seperate div, our map, given via ref={mapRef}

    // Future Devs: Feel free to adjust any setting to change the box or map page fitment or the general aesthetic!

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

  // MapWrapper to set state info and handle general geolocation features, like getting current user location
  // we need this to ensure the button "Get Current Location"" works as intended

  const MapWrapper = () => {

    // getter and setter for currentLoc state management, init as null so location isn't a default given (maybe change this later?)
    const [currentLocation, setCurrentLocation] = useState(null);

    // select current logged in user from the redux store
    const user = useSelector((store) => store.user);

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
        // boundary array meant for a polygon example, in Shrevesport, LA.
        // We need to think of logic to make this more dynamic, as mentioned above
      [
        { lat: 32.5252, lng: -93.763504 },
        { lat: 32.5302, lng: -93.760504 },
        { lat: 32.5272, lng: -93.755504 },
        { lat: 32.5222, lng: -93.758504 },
      ],

    ];

    // Return info below is relatively self-explanatory based on the information provided above in this component

    return (
      <div>
        <center>
          <h2 style={{ textAlign: "center", marginTop: "75px" }}>
            Welcome to Heyday {user.username}!
          </h2>
        </center>
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
              backgroundColor: "#057",
              "&:hover": {
                backgroundColor: "#046",
              },
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
            currentLocation={currentLocation}
          />
        </Wrapper>
        <Buttons />
        <UserNavBar />
      </div>
    );
  };

  return <MapWrapper />;
}

// export for UserLanding to be used elsewhere

export default UserLanding;
