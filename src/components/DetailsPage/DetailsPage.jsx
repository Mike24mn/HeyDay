import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DetailsPage.css'; 

function DetailsPage() {
    const [business, setBusiness] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); 
    const { id } = useParams();

    // Fetch business details whenever the ID changes
    useEffect(() => {
        fetchBusinessDetails();
    }, [id]);

    // Function to fetch business details from the API
    const fetchBusinessDetails = () => {
        fetch(`/api/business/${id}`)
            .then(response => {
                // Check if the response is okay
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Parse the JSON data from the response
                return response.json();
            })
            .then(data => {
                // Update the state with the fetched business data
                setBusiness(data);
            })
            .catch(error => {
                // Log any errors that occur during the fetch
                console.error('Error fetching business details:', error);
            });
    };
    
    // Function to show the next image in the gallery
    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            (prevIndex + 1) % (business.images.length) // Loop back to the first image
        );
    };
    
    // Display a loading message if business data is not yet available
    if (!business) {
        return <div>Loading...</div>;
    }
    

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
                        <button 
                            className="next-button" 
                            onClick={showNextImage}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            <p className="address"> Address: {business.address}</p>
            <p className="business-type">Type: {business.business_type}</p>
            <p className="description">Description: {business.description}</p>
            <p className="phone-number">Phone: {business.phone_number}</p>

            <h2 className="section-title">Diets</h2>
            <ul className="diet-list">
                {business.diets.map(diet => (
                    <li key={diet.id} className="diet-item">{diet.name}</li>
                ))}
            </ul>

            <h2 className="section-title">Happy Hours</h2>
            <ul className="happy-hour-list">
                {business.happy_hours.map((hh, index) => (
                    <li key={index} className="happy-hour-item">
                        {hh.day_of_week}: {hh.start_time} - {hh.end_time}
                    </li>
                ))}
            </ul>

            
        </div>
    );
}

export default DetailsPage;
