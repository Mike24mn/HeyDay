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
    const { business_id, business_name, address, business_type, description, phone_number}= req.body
    const queryText = `
    INSERT INTO "business" ( "business_id","business_name", "address", "business_type", "description","phone_number")
    VALUES($1,$2,$3,$4,$5,$6)
    `
    const queryValues = [ business_id, business_name, address, business_type, description, phone_number];

    pool.query(queryText, queryValues)
    .then((response)=>{
        console.log("checking response in POST bus router");
        res.status(200).json(response.rows[0])
    })
    .catch((error)=>{
        console.log("error in POST bus route", error);
    })
})

router.get('/:id', (req, res) => {
    const queryText = 'SELECT * FROM "business" WHERE id = $1;'
    pool.query(queryText, [req.params.id])
        .then((result) => {
            if (result.rows.length === 0){
            res.status(404).json({ error: 'Business not found!!!'})
            }
            else {
                res.json(result.rows[0])
            }
        })
        .catch((error) => {
            console.log("error in address route", error);
            res.sendStatus(500)
        })
})

module.exports = router 