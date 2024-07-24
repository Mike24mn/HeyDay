// routes/scraper.router.js
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer'); // this is javascripts html parsing/scraping library
const natural = require('natural');
const NodeGeocoder = require('node-geocoder'); // turns addresses into lat. and long. and vice versa

// Scraping function, given url
async function scrapeHappyHours(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  let happyHours = []; // instantiate empty happyHours array
  
  // Scraping logic will vary based on the website structure, will have to change for each of these websites
  // should make seperate functions for each site honestly
  happyHours = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.happy-hour-item')).map(item => ({
      name: item.querySelector('.name').innerText,
      address: item.querySelector('.address').innerText,
      deal: item.querySelector('.deal').innerText,
      time: item.querySelector('.time').innerText
    }));
  });

  await browser.close();
  return happyHours;
}

// NLP setup
// machine learning additions
const classifier = new natural.BayesClassifier();
classifier.addDocument('cozy atmosphere with dim lighting', 'cozy');
classifier.addDocument('trendy decor and modern art', 'trendy');
classifier.addDocument('dog-friendly patio', 'pet-friendly');
classifier.train();

function analyzeDescription(description) {
  return classifier.classify(description);
}

// Geocoding setup
// geocoding is for taking an address and turning it into lat and long points
// this allows us to put a pin on a map at its exact location
const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY
});
// grab coordinates from the address 
async function getCoordinates(address) {
  const res = await geocoder.geocode(address);
  return res[0] ? { lat: res[0].latitude, lng: res[0].longitude } : null;
}

// Route to trigger scraping
// used in front end to call the data and initiate the scraping
router.get('/scrape', async (req, res) => {
  try {
    const urls = [
      'https://twincities.eater.com/maps/best-happy-hour-twin-cities-minneapolis-st-paul',
      'https://www.yelp.com/search?find_desc=Happy+Hour&find_loc=Minneapolis%2C+MN',
      `https://feed.appyhourmobile.com/city/minneapolismn?sort=nearest`,
      `https://www.minnesotamonthly.com/food-drink/jason-derushas-favorite-happy-hours/`,
      `https://thethriftlist.com/happy-hours/minneapolis/`,
    ];

    // initialize empty array to eventually populate with happyhour deals after scraping
    let allHappyHours = [];
    // for loop below loops through ALL given urls
    for (let url of urls) {
      const happyHours = await scrapeHappyHours(url); // wait for scrapeHappyHours to finish
      allHappyHours = allHappyHours.concat(happyHours); // concatanate happyhours with those being scraped (aka each loop through)
    }

    const mappableHappyHours = await Promise.all(allHappyHours.map(async (hh) => {
      const coordinates = await getCoordinates(hh.address);
      const vibe = analyzeDescription(hh.deal);
      // return hh deal, coordinates, and vibe based on nlp processing/logic
      return {
        ...hh,
        coordinates,
        vibe
      };
    }));
// send as json
    res.json(mappableHappyHours);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'An error occurred while scraping data' });
  }
});

module.exports = router;