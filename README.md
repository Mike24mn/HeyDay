
Heyday ReadME:

Heyday is an interactive app designed to connect users with happy hour offers near them. The app has two interfaces: a user side and a business side, both of which are included in this repository.
Getting Started
To run this project locally, follow these steps:
Prerequisites
Install Visual Studio Code (VSCode) or your preferred code editor.
Ensure you have Node.js installed on your machine.
Installation
Clone the Repository:

git clone https://github.com/your-username/heyday.git
cd heyday


Install Dependencies:

npm install
npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
npm install @mui/material @emotion/react @emotion/styled
npm install @react-google-maps/api
npm install puppeteer
npm install natural
npm install node-geocoder
npm install dotenv

Database Setup:
You'll find an SQL script in the repo to set up your database. Run the script to create the necessary tables and data.
Run the Application:
Start the server and client:


npm run server
npm run client


Once running, you should see the app interface, with images and interactive features as described below.





Features
User Interface: Discover nearby happy hour offers, view detailed information, and interact with the map to find deals in specific areas.
Business Interface: Businesses can register, log in, and manage their happy hour offers, view analytics, and interact with users.
Google Maps Integration: The app uses the Google Maps API to provide geolocation and mapping services, allowing users to see offers in their vicinity.
Geolocation and GeoJSON: The app utilizes geolocation services and GeoJSON data to accurately map out city areas and highlight specific zones for happy hours.
Technologies Used
Frontend: JavaScript, HTML, CSS, React, Material-UI
Backend: Node.js, Express
Database: PostgreSQL (SQL script provided)
APIs: Google Maps API, Font Awesome for icons
Other: Geolocation, GeoJSON, Puppeteer, Natural.js, Node-Geocoder, dotenv

License
This project is licensed under the MIT License - see the LICENSE file for details.

