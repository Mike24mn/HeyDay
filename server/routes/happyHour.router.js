const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req,res)=>{
    const queryText = `
    SELECT * FROM "happyhour";
    `;

    pool.query(queryText)
    .then((result)=>{
        console.log("checking data in happyhour get ", result.rows);
        res.send(result.rows)
    })
    .catch((error)=>{
        console.log("error in happyhour get route", error );
        res.sendStatus(500)
    })
})

router.post('/', (req,res)=>{
    const {business_id, description, date, time} = req.body

    const queryText= `
    INSERT INTO "happyhour" ("business_id","description","date","time")
    VALUES($1,$2,$3,$4)
    `
    const queryValues = [business_id, description, date, time];

    pool.query(queryText, queryValues)
    .then((response)=>{
        console.log("Response in post happy route:", response);
      res.status(200).json(response.rows[0]);
    })

})


router.delete('/:id', (req, res)=>{


    const queryText= `
    DELETE FROM "happyhour" WHERE "id" = $1;
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