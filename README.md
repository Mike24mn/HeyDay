Heyday:

Heyday is an interactive app designed to connect users with happy hour offers near them. The app features two interfaces: a user side and a business side, both included in this repository.

Getting Started
Prerequisites:

Code Editor: Install Visual Studio Code (VSCode) or your preferred IDE.

Node.js: Ensure Node.js is installed on your machine.
-------------------------------------------------------------------------------------------

Installation
Clone the Repository and open on your local machine:

log in to github
click on repositories
click the code button seen on the screen
click SSH and then copy the address you see
open a terminal on your computer
create a folder on computer where you would like the file to be located
after navigating to this file location within your terminal run the following command in terminal

"git clone https://github.com/your-username/heyday.git"

Finally, to pull up the repo in vss code, type "code ." within the terminal

Install Dependencies:

Run these commands within the project directory of your VSS code IDE, or whichever IDE you are using:

npm install
npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
npm install @mui/material @emotion/react @emotion/styled
npm install @react-google-maps/api
npm install puppeteer
npm install natural
npm install node-geocoder
npm install dotenv


Environment Variables:

After installing dotenv, create a .env file in the root directory. This file will hold any API keys or other sensitive information. Ensure the .env file is listed in your .gitignore file to prevent it from being uploaded to GitHub (this is important if you intend on pushing any changes back to Github)

Format of the .env file:

Your .env file should be in the exact format listed below and the .env created within the root of the project directory:

"VITE_GOOGLE_MAPS_API_KEY=<enter-your-google-api-key-here>"

Note, the step above involves creating a Google developer account and registering with them as a developer in order to receive an API key.
It is a necessary step to get the maps working within the App.

# Environment variables:
.env (as mentioned above)


# IDE files
.vscode/

Database Setup:

An SQL script is provided in the repository to set up the database. Run the script to create the necessary tables and data.
running this script requires database management system, install Postgres and Postico, configure Postgres to connect to localhost
then run the database.sql file (located in the repository) within Postico to create the database used in this project.

Running the Application
Start the server and client:
Within a split window terminal in the project directory, run the two commands below,

npm run server
npm run client

Once running, navigate to the localhost address listed in the terminal that npm run client was ran in,  you should see the app interface, complete with images and interactive features.

Features:
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

