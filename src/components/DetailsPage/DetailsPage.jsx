
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { useState } from "react";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import { icon } from "leaflet";
// import UserNavBar from "../UserNavBar/UserNavBar";

// function DetailsPage() {
//   const [getDetails, setDetails] = useState([]);
//   const [getTerm, setTerm] = useState("");
//   const [getLocation, setLocation] = useState("");
//   const user = useSelector((store) => store.user);
//   const dispatch = useDispatch();

//   const handleSearch = () => {
//     fetch(
//       `http://localhost:5001/api/search?term=${getTerm}&location=${getLocation}`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         setDetails(data);
//         console.log("checking-data: ", data);
//       })
//       .catch((error) => {
//         console.log("error in yelp fetch in details", error);
//       });
//   };

//   const handleFav = (event, details) => {
//     event.preventDefault();
//     const id = user.id;
//     console.log("checking id", id);

//     dispatch({
//       type: "ADD_FAV",
//       payload: { ...details, user_id: id, address: details.location.address1 },
//     });
//   };

//   return (
//     <>
//       <div>
//         <input
//           type="text"
//           placeholder="search term"
//           value={getTerm}
//           onChange={(event) => setTerm(event.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="location"
//           value={getLocation}
//           onChange={(event) => setLocation(event.target.value)}
//         />
//         <button onClick={handleSearch}>SEARCH</button>
//       </div>
//       <div>
//         {getDetails.length > 0 ? (
//           getDetails.map((details, index) => (
//             <div key={index} style={{ marginBottom: "20px" }}>
//               <div>Name: {details.name}</div>
//               <img
//                 src={details.image_url}
//                 alt={details.name}
//                 style={{ width: "100px", height: "100px" }}
//               />
//               <div>Rating: {details.rating}</div>
//               <div>Number: {details.phone}</div>
//               <div>
//                 Address:{" "}
//                 {`${details.location.address1} ${details.location.address2} ${details.location.address3}, ${details.location.city}, ${details.location.zip_code}`}
//               </div>
//               <div>Amount of reviews: {details.review_count}</div>
//               <button onClick={(event) => handleFav(event, details)}>
//                 <FavoriteIcon />
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No details available</p>
//         )}
//         <center><UserNavBar /></center>
//       </div>
//     </>
//   );
// }

// export default DetailsPage;





import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

function DetailsPage() {
  const location = useLocation();
  const { id } = useParams();
  const { locationDetails } = location.state || {};

  console.log('Details page - Location state:', location.state);
  console.log('Details page - ID from params:', id);

  const handleFav = (event, details) => {
    event.preventDefault();
    const id = user.id;
    console.log("checking id", id);

    dispatch({
      type: "ADD_FAV",
      payload: { ...details, user_id: id, address: details.location.address1 },
    });
  }

  if (!locationDetails) {
    return <div>No location details available</div>;
  }

  return (
    <div>

      <h1>Details Page</h1>
      
      <h2>{locationDetails.name || 'Unknown Location'}</h2>
      <p>Address: {locationDetails.address || 'Address not available'}   <button onClick={(event) => handleFav(event, details)}>❤️</button> </p>
      {locationDetails.image && (
        <img src={locationDetails.image} alt={locationDetails.name} style={{ maxWidth: '50%', height: 'auto' }} />
      )}
     
     
    </div>
    

  );
}

export default DetailsPage;