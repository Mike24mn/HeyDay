const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/',(req,res)=>{
    const queryText = `
    SELECT * FROM "business"`;
    

    pool.query(queryText)
    .then( (result)=>{
        console.log("checking result", result.rows)
        res.send(result.rows)
       
    })
    .catch((error)=>{
        console.log("error in business GET route", error );
    })
})

router.get('/:id', (req, res) => {
    const businessId = req.params.id;
    const queryText = `
        SELECT 
            b.*,
            json_agg(DISTINCT jsonb_build_object('id', d.id, 'name', d.name)) AS diets,
            json_agg(DISTINCT jsonb_build_object(
                'id', h.id, 
                'start_time', h.start_time, 
                'end_time', h.end_time, 
                'day_of_week', h.day_of_week
            )) AS happy_hours,
            json_agg(DISTINCT bi.image_url) AS images
        FROM "business" b
        LEFT JOIN "business_diet" bd ON b.id = bd.business_id
        LEFT JOIN "diet" d ON bd.diet_id = d.id
        LEFT JOIN "happy_hour" h ON b.id = h.business_id
        LEFT JOIN "business_image" bi ON b.id = bi.business_id
        WHERE b.id = $1
        GROUP BY b.id`;

        //Select all columns from the business table
        //combines multiple rows of data into a single JSON array.
        //connect the business table with other related tables (business_diet, diet, happy_hour, business_image).
        //filters the results to include only the business with the ID specified by $1
        //groups the results by the business ID (b.id).
    
    pool.query(queryText, [businessId])
        .then((result) => {
            if (result.rows.length > 0) {
                res.send(result.rows[0]);
            } else {
                res.status(404).send('Business not found');
            }
        })
        .catch((error) => {
            console.log("Error in business GET by ID route", error);
            res.status(500).send('Server error');
        });
});
  
router.post('/', (req,res)=>{
    const { business_id, business_name, address, business_type, description}= req.body
    const queryText = `
    INSERT INTO "business" ( "business_id","business_name", "address", "business_type", "description")
    VALUES($1,$2,$3,$4,$5)
    `
    const queryValues = [ business_id, business_name, address, business_type, description];

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