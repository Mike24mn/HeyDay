const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
  const queryText = `
  SELECT * FROM  "favorites" 
  `
 pool.query(queryText)
 .then((result)=>{
  console.log("checking data: ", result.rows)
  res.send(result.rows)
  res.sendStatus(200)
 })
 .catch ((error)=>{
  console.log("error in in get route", error );
 })
});

/**
 * POST route template
 */
router.post('/favorites', (req, res) => {
  const { user_id, name, address } = req.body;
  const queryText = `
  INSERT INTO "favorites" ("user_id", "name", "address")
  VALUES($1, $2, $3)
  RETURNING *; 
  `
  const queryValues = [user_id, name, address]

 
  pool.query(queryText, queryValues)
  .then(response => {
      console.log("Response in post route:", response);
      res.status(200).json(response.rows[0]);
    })
    .catch(error => {
      console.log("error in post route", error);
      res.sendStatus(500);
    });
});
module.exports = router;
