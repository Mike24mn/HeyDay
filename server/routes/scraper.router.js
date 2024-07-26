// routes/scraper.router.js
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');  // this is javascripts html parsing/scraping library
const natural = require('natural'); // natural supports tokenization and 
// classification of data/words, which
// allows us to break down language into segments for our
// machine learning nlp library

const NodeGeocoder = require('node-geocoder'); // turns addresses into lat. and long. and vice versa

const fs = require('fs').promises; // file system for reading/writing purposes
// promises specifically provide async file system methods based on failure
// or success. Its how we get the .json file to save to our root directory
// (will need logic if we want to READ that file eventually though)


// scraper function, takes URL parameter and scans the url for
// the data we are looking for (bars and restaurants with happy hours)
// this runs in a headless (no gui) terminal

async function scrapeHappyHours(url) {

  console.log("Scraping:", url); // log it so we know what url we're scraping at the moment
  // helps use keep track of the process

  const browser = await puppeteer.launch({headless: 'new'}); // use headless mode with puppeteer

  const page = await browser.newPage(); // this opens new pages in the "browser"

  await page.goto(url, {waitUntil: 'networkidle0'}); // go to the given url, and wait 
  // until no network connections for 500ms; we do this to prevent causing
  // server issues for the websites we are scraping and also
  // to prevent being timed out or blocked access to a site 
  // for intiaiting too many requests in a short period of time

  let happyHours = []; // init empty array to store scraped info
  
  try {
    // scraping logic

    // page.evaluate function for exceuting JS on the page we are currently on
    happyHours = await page.evaluate(() => {

      const items = document.querySelectorAll('div, p, span'); // grab all divs, paragraphs, and spans


      // extract the text and HTML content of element then filter the ones that have 'happy hour', 'discount', or 'special' in them
      // we can mess with this to select different text contents from the page
      // as in, we could add a item.text.toLowerCase().includes('drinks')
      // if we wanted to 
      return Array.from(items).map(item => ({
        text: item.innerText,
        html: item.innerHTML
      })).filter(item => 
        item.text.toLowerCase().includes('happy hour') || 
        item.text.toLowerCase().includes('discount') ||
        item.text.toLowerCase().includes('special')
      );
    });
  } catch (error) {
    // error handling that lets us know which url we
    // are having issues with and what the error is
    console.error(`Error scraping ${url}:`, error);
  }

  await browser.close(); // this closes the browser and page when we are done
  return happyHours; // return for the scraped data
}


// this is where natural.js is used for machine learning and
// language processing, the first line inits a a new instance 
// of natural
const classifier = new natural.BayesClassifier();

// this is training info, TEAM: if you need more references about how this
// works check out commented section at the bottom of the AboutPage.jsx

classifier.addDocument('cozy atmosphere with dim lighting', 'cozy');
classifier.addDocument('trendy decor and modern art', 'trendy');
classifier.addDocument('dog-friendly patio', 'pet-friendly');

// this is the method to train the machine
classifier.train();

// this function analyzes the descriptions using info we trained the model with
// we can add more training above but we need to keep an eye on confidence levels
// and over/under fitment of the model
function analyzeDescription(description) {
    // return the description
  return classifier.classify(description);
}

// this is used to translate addresses to geo. cordinates and vice versa,
// provider lets us use it with the Google Maps provider and API key 
// calls the key from within our .env file in the root

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY
});

// this is the function that grabs the actual address
// coordinates then geocodes the given address over to coords, based on lng and lat
async function getCoordinates(address) {
  try {
    const res = await geocoder.geocode(address);
    // if you find coordinates, return them, otherwise return null
    return res[0] ? { lat: res[0].latitude, lng: res[0].longitude } : null;
  } catch (error) {
    console.error('Geocoding error:', error); // log errors related to the geocoding process
    return null;
  }
}

// this is our route for scraping, we can add more urls here if needed
// but the data structures and formatting of each website is different
// keep this in mind because we might have to change the info we are grabbing
// it might be worth it to create seperate functions
// for simplifying the json object we get

router.get('/scrape', async (req, res) => {
  try {
    // if we wanted to add additional urls to scrape, add them
    // as a string here to this array
    const urls = [
      'https://twincities.eater.com/maps/best-happy-hour-twin-cities-minneapolis-st-paul',
      'https://www.yelp.com/search?find_desc=Happy+Hour&find_loc=Minneapolis%2C+MN',
      'https://feed.appyhourmobile.com/city/minneapolismn?sort=nearest',
      'https://www.minnesotamonthly.com/food-drink/jason-derushas-favorite-happy-hours/',
      'https://thethriftlist.com/happy-hours/minneapolis/',
    ];

    // initialize empty allHappyHours array to store all the happy hour
    // data
    let allHappyHours = [];
    // for of loop that scrapes the given happy hour urls
    // this is so each url is cycled (iterated) through and the data
    // from the scraping gets concatenated to the 
    // allHappyHours array
    for (let url of urls) {
      const happyHours = await scrapeHappyHours(url);
      allHappyHours = allHappyHours.concat(happyHours);
    }

    // usse promise.all to wait for async ops in the array to complete!!!
    // allHappyHours.map creates new array where each element is a promise obj. returned from the async function

    // process the scraped data to get all coordinates and analyze it for
    // descriptions we want
    const mappableHappyHours = await Promise.all(allHappyHours.map(async (hh) => {
      const coordinates = await getCoordinates(hh.text); // use 'text' instead of 'address', gotta mess with this more, this gets coordinates for the text its given essentially
      // use analyzer to decipher happyhour text
      // and return an object with coords, hh, and vibe
      const vibe = analyzeDescription(hh.text);
      return {
        ...hh,
        coordinates,
        vibe
      };
    }));

    // save the data to a JSON file in our routes directory
    // convert to JSON string using mappableHappyHours array,
    // null means include all properties of the object (meaning not seperated or disincluding anything))
    // 2 tells the writing how much white space to use while writing,
    await fs.writeFile('happyHours.json', JSON.stringify(mappableHappyHours, null, 2));
    console.log('Data saved to happyHours.json');

    console.log('Scraped happy hours:', mappableHappyHours);

    // send as JSON
    res.json(mappableHappyHours);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'An error occurred while scraping data', details: error.message });
  }
});

module.exports = router;