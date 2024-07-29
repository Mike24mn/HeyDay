
import React, { useState, useRef, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { useHistory } from 'react-router-dom'; 
import { Wrapper, Status } from "@googlemaps/react-wrapper"; 
import Buttons from "../Buttons/Buttons";
import UserNavBar from "../UserNavBar/UserNavBar"; 
import "leaflet/dist/leaflet.css"; 

// Define the main component that will display the Google Map
const GoogleMapComponent = ({ center, zoom, boundaries, currentLocation, searchTerm, onSearch }) => {
  const mapRef = useRef(null); // Create a reference for the map DOM element
  const inputRef = useRef(null); // Create a reference for the input DOM element
  const autocompleteRef = useRef(null); // Create a reference for the autocomplete instance
  const [map, setMap] = useState(null); // State to hold the map instance
  const [isMapLoaded, setIsMapLoaded] = useState(false); // State to track if the map is loaded

  const history = useHistory(); 

  // Function to navigate to the details page with location details
  const navigateToDetailsPage = (place) => {
    if (place && place.geometry && place.geometry.location) {
      const locationDetails = {
        name: place.name || "Unknown Name",
        address: place.vicinity || place.formatted_address || "Unknown Address",
        image: place.photos && place.photos.length > 0 ? place.photos[0].getUrl() : "",
        place_id: place.place_id,
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      };

      // Use history.push to navigate to the details page with location details
      history.push({
        pathname: `/user-details/${place.place_id || 'location'}`,
        state: { locationDetails }
      });
    } else {
      console.error('No valid place data available. Place object:', place); // Log error if place data is invalid
    }
  };

  // useEffect hook to initialize the map and add boundaries and autocomplete
  useEffect(() => {
    if (mapRef.current && !isMapLoaded) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: "2182bd31b6274e24",
      });
      setMap(mapInstance);
      setIsMapLoaded(true);

      // Add boundaries to the map
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

      // Initialize autocomplete for the input element
      if (inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['restaurant', 'bar'],
            componentRestrictions: { country: "us" },
          }
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
          searchRestaurantsAndBars(mapInstance, place.geometry.location);
          onSearch(inputRef.current.value);
        });
      }
    }
  }, [center, zoom, boundaries, onSearch, isMapLoaded]);

  // useEffect hook to update the map when current location or search term changes
  useEffect(() => {
    if (isMapLoaded && map) {
      if (currentLocation) {
        const marker = new window.google.maps.Marker({
          position: currentLocation,
          map: map,
        });
        map.setCenter(currentLocation);

        marker.addListener("click", () => {
          navigateToDetailsPage({
            name: "Current Location",
            geometry: {
              location: new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng)
            },
            vicinity: "Your current location"
          });
        });

        searchRestaurantsAndBars(map, currentLocation);
      }

      if (searchTerm && autocompleteRef.current) {
        autocompleteRef.current.setBounds(map.getBounds());
        const request = {
          query: searchTerm,
          fields: ["name", "geometry"],
        };
        const service = new window.google.maps.places.PlacesService(map);
        service.findPlaceFromQuery(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const place = results[0];
            if (place.geometry && place.geometry.location) {
              map.setCenter(place.geometry.location);
              map.setZoom(17);
              const marker = new window.google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
              });

              marker.addListener("click", () => {
                navigateToDetailsPage(place);
              });
            }
          }
        });
      }
    }
  }, [isMapLoaded, map, currentLocation, searchTerm]);

  // Function to add a marker with a click listener on the map
  const addMarkerWithClickListener = (place, mapInstance) => {
    // Check if the place has geometry and a location
    if (place.geometry && place.geometry.location) {
      // Create a new marker on the map at the place's location
      const marker = new window.google.maps.Marker({
        position: place.geometry.location, // Position the marker at the place's location
        map: mapInstance, // Add the marker to the provided map instance
        title: place.name, // Set the title of the marker to the place's name
      });
  
      // Add a click listener to the marker
      marker.addListener("click", () => {
        // Create a new PlacesService instance for the provided map
        const service = new window.google.maps.places.PlacesService(mapInstance);
        
        // Use the PlacesService to get detailed information about the place
        service.getDetails(
          {
            placeId: place.place_id, // Use the place ID to get details
            fields: ['name', 'formatted_address', 'photos', 'geometry', 'vicinity'] // Specify the fields to retrieve
          },
          (result, status) => {
            // Check if the request was successful
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              console.log('Fetched place details:', result); // Log the place details
              // Navigate to the details page with the fetched place details
              navigateToDetailsPage(result);
            } else {
              // Log an error if the request failed
              console.error('Error fetching place details:', status);
            }
          }
        );
      });
    }
  };
  

  // Function to search for nearby restaurants and bars
  const searchRestaurantsAndBars = (mapInstance, location) => {
    const service = new window.google.maps.places.PlacesService(mapInstance);
    const request = {
      location,
      radius: "5000",
      type: ["restaurant", "bar"],
    };
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach((place) => {
          addMarkerWithClickListener(place, mapInstance);
        });
      }
    });
  };

  // Return the JSX for the map component
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <div style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        display: "flex",
      }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for restaurants and bars"
          style={{
            boxSizing: "border-box",
            border: "1px solid transparent",
            width: "240px",
            height: "32px",
            padding: "0 12px",
            borderRadius: "3px 0 0 3px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            fontSize: "14px",
            outline: "none",
            textOverflow: "ellipsis",
          }}
        />
      </div>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

// Wrapper component to manage the state and render the map component
const MapWrapper = () => {
  const [currentLocation, setCurrentLocation] = useState(null); // State to hold the current location
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const user = useSelector((store) => store.user); // Get the user from the redux store
  const dispatch = useDispatch(); // Initialize useDispatch hook for dispatching actions

  // Function to handle search and update the search term
  const handleSearch = (value) => {
    dispatch({ type: 'ADD_HISTORY', payload: { search_history: value } });
    setSearchTerm(value);
  };

  // Function to get the current location of the user
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
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

  // Define the boundaries for the map
  const boundaries = [
    [
      { lat: 32.5252, lng: -93.763504 },
      { lat: 32.5302, lng: -93.760504 },
      { lat: 32.5272, lng: -93.755504 },
      { lat: 32.5222, lng: -93.758504 },
    ],
  ];

  // Function to render the status of the map loading process
  const renderStatus = (status) => {
    switch (status) {
      case Status.LOADING:
        return <div>Loading...</div>;
      case Status.FAILURE:
        return <div>Failed to load the map</div>;
      case Status.SUCCESS:
        return <div>Map Loaded Successfully</div>;
      default:
        return null;
    }
  };

  // Return the JSX for the wrapper component
  return (
    <div>
      <h2>Welcome to Heyday, {user.username}!</h2>
      <Buttons />
      <center>
        <button onClick={handleGetCurrentLocation}>Get Current Location</button>
      </center>
      <Wrapper
        apiKey="AIzaSyAcpUJDqdGX7QpeHHW4wDEhPweGabLUL_E"
        libraries={["places", "marker"]}
        render={renderStatus}
      >
        <GoogleMapComponent
          center={{ lat: 32.5252, lng: -93.763504 }}
          zoom={15}
          boundaries={boundaries}
          currentLocation={currentLocation}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />
      </Wrapper>
      <UserNavBar />
    </div>
  );
};

// Export the MapWrapper component as the default export
export default MapWrapper;
