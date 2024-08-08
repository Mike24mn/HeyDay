Heyday
Heyday is an interactive app designed to connect users with happy hour offers near them. The app features two interfaces: a user side and a business side, both included in this repository.

Getting Started
Prerequisites
Code Editor: Install Visual Studio Code (VSCode) or your preferred code editor.
Node.js: Ensure Node.js is installed on your machine.
Installation
Clone the Repository:

bash
Copy code
git clone https://github.com/your-username/heyday.git
cd heyday
Install Dependencies:

bash
Copy code
npm install
npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
npm install @mui/material @emotion/react @emotion/styled
npm install @react-google-maps/api
npm install puppeteer
npm install natural
npm install node-geocoder
npm install dotenv
Environment Variables:

After installing dotenv, create a .env file in the root directory. This file will hold any API keys or other sensitive information. Ensure the .env file is listed in your .gitignore file to prevent it from being uploaded to GitHub.

Example of a .env file:

plaintext
Copy code
PORT=5000
DB_HOST=localhost
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
Example of a .gitignore file:

plaintext
Copy code
# Node modules
node_modules/

# Logs
logs/
*.log
npm-debug.log*

# Environment variables
.env

# Build artifacts
build/
dist/

# OS-specific files
.DS_Store

# IDE files
.vscode/
.idea/
Import Environment Variables:

To use the environment variables in your application, add the following code at the top of your entry file (e.g., app.js or index.js):

javascript
Copy code
require('dotenv').config();

const port = process.env.PORT;
const dbHost = process.env.DB_HOST;
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

console.log(`Server is running on port: ${port}`);
console.log(`Database host: ${dbHost}`);
console.log(`Google Maps API Key: ${googleMapsApiKey}`);
Database Setup
An SQL script is provided in the repository to set up the database. Run the script to create the necessary tables and data.

Running the Application
Start the server and client:

bash
Copy code
npm run server
npm run client
Once running, you should see the app interface, complete with images and interactive features.

Features
User Interface: Discover nearby happy hour offers, view detailed information, and interact with the map to find deals in specific areas.
Business Interface: Businesses can register, log in, manage their happy hour offers, view analytics, and interact with users.
Google Maps Integration: Provides geolocation and mapping services, allowing users to see offers in their vicinity.
Geolocation and GeoJSON: Utilizes geolocation services and GeoJSON data to accurately map city areas and highlight specific zones for happy hours.
Technologies Used
Frontend: JavaScript, HTML, CSS, React, Material-UI
Backend: Node.js, Express
Database: PostgreSQL (SQL script provided)
APIs: Google Maps API, Font Awesome for icons
Other: Geolocation, GeoJSON, Puppeteer, Natural.js, Node-Geocoder, dotenv
License
This project is licensed under the MIT License - see the LICENSE file for details.
