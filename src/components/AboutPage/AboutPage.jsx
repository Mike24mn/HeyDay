import React, { useEffect, useRef } from "react"; // Note to self, useRef allows for  a single render of the SAME content, meaning that its can PERSIST values between render events basically
import L from "leaflet"; // importing leaflet as L, could import it as Leaflet too but this is easier
import "leaflet/dist/leaflet.css";

import UserNavBar from '../UserNavBar/UserNavBar';

import { Wrapper, Status } from "@googlemaps/react-wrapper"; // google wrapper

// Note to team, Josh, Kalia, this could serve as out Getting Started page, just have to rename it in the MUI bar

function AboutPage() {

  return (
      <div>
        <p>This about page is for anyone to read!</p>

      <center><UserNavBar /></center>
    </div>
  );
}

export default AboutPage;




/*
// Misc. Code for a Leaflet Style Map Below:
  const leafletMapRef = useRef(null); // create a reference point using the hook, set it null initially since we don't have a DOM at this point (after mount and dom is created apply .current to the DOM element)
  // this references the DOM element in the html below, where we will render a map for HeyDay!
useEffect(() => {
  if (leafletMapRef.current) {
    // run the map when our component mounts (AKA using useEffect)
    //

    const map = L.map(leafletMapRef.current).setView(
      [32.5252, -93.763504],
      15
    );
    // This is how we create an instance of a map and send it to the ref
    // listed below in the return HTML
    // setView allows us to pick a latitude and longitude coordinate and
    // a "starting" zoom level (the 13 after the comma)

    // Tile layer is a leaflet method that creates tiles/grids for the map
    // we can grab other map tiles from different URLS by passing
    // different URLs that host tiles. NOTE: The copyright and usage
    // of these tiles are tricky AND NEED TO BE READ ABOUT IN DETAIL
    // BEOFRE ANY COMMERCIAL/LARGE SCALE APP DEPLOYMENT

    // maxZoom sets zoom, attribution gives credit to the provider
    // and addTo(map) applies the actual tile layer to the map instance above
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map); // this essentially adds a location to the map via a marker; This should be London, the .addTo(map) adds it to the map, like above
    return () => {
      map.remove(); // remove the map when the componenet unmounts to free up memory/resources, this is a good practice with maps especially, as they are data hogs
    };
  }
}, []); // dependency arry, only run when first mounted since its empty, remember we can force rerenders here by providing a variable within the array, when the variable changes, a rerender would be triggered

return (
  <div
  ref={leafletMapRef}
  style={{ height: "500px", width: "100%" }}
></div>
)

*/
