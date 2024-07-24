const express = require("express");
const app = express();
const yelp = require('yelp-fusion');
const cors = require('cors');
const favoritesRouter = require('./routes/favorites.router.js')
require('dotenv').config();


const scraperRouter = require("./routes/scraper.router.js"); // scraping router
require("dotenv").config();

const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route Includes
const userRouter = require("./routes/user.router");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes

app.use("/api/user", userRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/scraper", scraperRouter);

const apiKey =
  "6ONLrF40aWp2jP__Bxi14hEEFXPj8161PsM3hAErgO03eXQWYIaw4aDAS-i1aGq3u9-dirq6NW9HD_xfglFTK1LANGuFzgOeEBsVWdQqoen9jM1SHOrkfydI1HeZZnYx";

app.get("/api/search", (req, res) => {
  const client = yelp.client(apiKey);

  const term = req.query.term;
  const location = req.query.location;
  const searchRequest = {
    term: term,
    location: location,
    limit: 1,
  };

  client
    .search(searchRequest)
    .then((response) => {
      res.json(response.jsonBody.businesses);
    })
    .catch((e) => {
      console.error("Error during Yelp API request:", e);
      res.status(500).send(e);
    });

});

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
