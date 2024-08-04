import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailsPage.css";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import UserNavBar from "../UserNavBar/UserNavBar";



function DetailsPage() {
  const [business, setBusiness] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const favorites = useSelector((state) => state.favorites);
  console.log("Current favorites", favorites);

  // Fetch business details whenever the ID changes
  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  // Function to fetch business details from the API
  const fetchBusinessDetails = () => {
    fetch(`/api/business/${id}`)
      .then((response) => {
        // Check if the response is okay
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON data from the response
        return response.json();
      })
      .then((data) => {
        // Update the state with the fetched business data
        setBusiness(data);
      })
      .catch((error) => {
        // Log any errors that occur during the fetch
        console.error("Error fetching business details:", error);
      });
  };

  // Function to show the next image in the gallery
  const showNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % business.images.length // Loop back to the first image
    );
  };

  // Display a loading message if business data is not yet available
  if (!business) {
    return <div>Loading...</div>;
  }

  const handleFav = () => {
    console.log("handleFav clicked");
    const userId = user.id;
    console.log("checking id", userId);
    dispatch({
      type: "ADD_FAV",
      payload: {
        user_id: userId,
        name: business.business_name,
        address: business.address,
      },
    });
    console.log("ADD_FAV action dispatched");
  };

  // Construct Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;

  return (
    <div className="details-page">
      <h1 className="business-name">{business.business_name}</h1>
      <div className="image-gallery">
        {business.images.length > 0 && (
          <div className="image-container">
            <img
              src={business.images[currentImageIndex]}
              alt={`${business.business_name} ${currentImageIndex + 1}`}
              className="business-image"
            />
            <div className="buttons-container">
              <button className="favorite-button" onClick={handleFav}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button className="next-icon" onClick={showNextImage}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="address">
        Address:{" "}
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          {business.address}
        </a>
      </p>
     
      <p className="description"> Description: {business.description}</p>
      <p className="phone-number">Phone Number: {business.phone_number}</p>
      <p className="business-type">Type : {business.business_type}</p>
      
      
      <h2 className="section-title">Diets</h2>

      <ul className="diet-list">
       
        {business.diets.map((diet) => (
          <li key={diet.id} className="diet-item">
            {diet.name}
          </li>
        ))}
      </ul>
      
      <h2 className="section-title">Vibes</h2>
      <ul className="diet-list">
        {business.vibes.map((vibe) => (
          <li key={vibe.id} className="diet-item">
            {vibe.name}
          </li>
        ))}
      </ul>
    
      
      <h2 className="section-title">Happy Hours</h2>
      <ul className="happy-hour-list">
        {business.happy_hours.map((hh, index) => (
          <li key={index} className="happy-hour-item">
            {hh.day_of_week}:{" "}
            {new Date(`1970-01-01T${hh.start_time}`).toLocaleTimeString(
              "en-US",
              { hour: "numeric", minute: "2-digit", hour12: true }
            )}{" "}
            -{" "}
            {new Date(`1970-01-01T${hh.end_time}`).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </li>
        ))}
      </ul>
      <UserNavBar />
    </div>
  );
}

export default DetailsPage;
