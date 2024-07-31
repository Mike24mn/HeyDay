const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/',(req,res)=>{
    const queryText = `
    SELECT * FROM "business";
    `;

    pool.query(queryText)
    .then( (result)=>{
        console.log("checking result", result.rows)
        res.send(result.rows)
       
    })
    .catch((error)=>{
        console.log("error in business GET route", error );
    })
})


router.post('/', (req,res)=>{
    const {  business_name, address, business_type, description, user_id, phone_number}= req.body
    const queryText = `
    INSERT INTO "business" ("business_name", "address","description", "business_type", "user_id","phone_number")
    VALUES($1,$2,$3,$4,$5,$6)
    `
    const queryValues = [  business_name, address, business_type, description, user_id,  phone_number];

    pool.query(queryText, queryValues)
    .then((response)=>{
        console.log("checking response in POST bus router");
        res.status(200).json(response.rows[0])
    })
    .catch((error)=>{
        console.log("error in POST bus route", error);
    })
})

module.exports = router 