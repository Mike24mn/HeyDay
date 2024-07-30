const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req,res)=>{
    const queryText = `
    SELECT * FROM "happy_hour";
    `;

    pool.query(queryText)
    .then((result)=>{
        console.log("checking data in happy_hour get ", result.rows);
        res.send(result.rows)
    })
    .catch((error)=>{
        console.log("error in happyhour get route", error );
        res.sendStatus(500)
    })
})

router.post('/', (req,res)=>{
    const {  user_id,    date, start_time} = req.body

    const queryText= `
    INSERT INTO "happy_hour" ("user_id","date","start_time")
    VALUES($1,$2,$3)
    `
    const queryValues = [ user_id,    date, start_time];

    pool.query(queryText, queryValues)
    .then((response)=>{
        console.log("Response in post happy route:", response);
      res.status(200).json(response.rows[0]);
    })

})


router.delete('/:id', (req, res)=>{


    const queryText= `
    DELETE FROM "happy_hour" WHERE "id" = $1;
    `
    pool.query(queryText, [req.params.id])
    .then((result)=>{
      console.log(result)
      res.sendStatus(200)
    })
    .catch((error)=>{
      console.log("error in delete fav route ", error);
    })
  })



module.exports = router;