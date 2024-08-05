const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/all-details', (req, res) => {
    console.log('GET /api/business/all-details called');
    const query = `
      SELECT 
        business.id, 
        business.business_name, 
        business.address, 
        happy_hour.start_time, 
        happy_hour.end_time, 
        happy_hour.day_of_week,
        STRING_AGG(DISTINCT diet.name, ', ') AS diets
      FROM 
        business
      LEFT JOIN 
        happy_hour ON business.id = happy_hour.business_id
      LEFT JOIN 
        business_diet ON business.id = business_diet.business_id
      LEFT JOIN 
        diet ON business_diet.diet_id = diet.id
      GROUP BY 
        business.id, happy_hour.id
    `;
  
    pool.query(query)
      .then((result) => {
        console.log('Query executed successfully');
        console.log('Fetched businesses:', result.rows);
        res.json(result.rows);
      })
      .catch((err) => {
        console.error('Error executing query:', err);
        res.status(500).json({ error: err.toString() });
      });
  });


router.get('/', (req, res) => {
  const queryText = `SELECT * FROM "business"`;
  pool.query(queryText)
    .then(result => {
      res.send(result.rows);
    })
    .catch(error => {
      console.log('Error in business GET route', error);
      res.sendStatus(500);
    });
});

router.get('/', (req, res) => {
  const queryText = `SELECT * FROM "business"`;
  pool.query(queryText)
    .then(result => {
      res.send(result.rows);
    })
    .catch(error => {
      console.log('Error in business GET route', error);
      res.sendStatus(500);
    });
});

router.get('/:id', (req, res) => {
  const businessId = req.params.id;
  const queryText = `
  SELECT b.*, 
    json_agg(DISTINCT jsonb_build_object('id', d.id, 'name', d.name)) AS diets, 
    json_agg(DISTINCT jsonb_build_object('id', v.id, 'name', v.name)) AS vibes, 
    json_agg(DISTINCT jsonb_build_object('id', h.id, 'start_time', h.start_time, 'end_time', h.end_time, 'day_of_week', h.day_of_week)) AS happy_hours, 
    json_agg(DISTINCT bi.image_url) AS images 
  FROM "business" b 
  LEFT JOIN "business_diet" bd ON b.id = bd.business_id 
  LEFT JOIN "diet" d ON bd.diet_id = d.id 
  LEFT JOIN "business_vibe" bv ON b.id = bv.business_id 
  LEFT JOIN "vibe" v ON bv.vibe_id = v.id 
  LEFT JOIN "happy_hour" h ON b.id = h.business_id 
  LEFT JOIN "business_image" bi ON b.id = bi.business_id 
  WHERE b.id = $1 
  GROUP BY b.id;
`;
  pool.query(queryText, [businessId])
    .then(result => {
      if (result.rows.length > 0) {
        res.send(result.rows[0]);
      } else {
        res.status(404).send('Business not found');
      }
    })
    .catch(error => {
      console.log('Error in business GET by ID route', error);
      res.status(500).send('Server error');
    });
});

  //Select all columns from the business table
  //combines multiple rows of data into a single JSON array.
   //connect the business table with other related tables (business_diet, diet, happy_hour, business_image).
    //filters the results to include only the business with the ID specified by $1
     //groups the results by the business ID (b.id).

     router.post('/', (req, res) => {
      const { business_name, address, business_type, description, user_id, phone_number, vibe, diet, image_url } = req.body;
      pool.connect()
          .then(client => {
              client.query('BEGIN')
                  .then(() => {
                      // Insert into business table
                      const businessQuery = `
                          INSERT INTO "business" ("business_name", "address", "description", "business_type", "user_id", "phone_number")
                          VALUES ($1, $2, $3, $4, $5, $6)
                          RETURNING id
                      `;
                      const businessValues = [business_name, address, description, business_type, user_id, phone_number];
                      return client.query(businessQuery, businessValues)
                          .then(businessResult => {
                              const businessId = businessResult.rows[0].id;
  
                              // Insert vibe
                              if (vibe) {
                                  const vibeQuery = `
                                      INSERT INTO "vibe" ("name")
                                      VALUES ($1)
                                      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                                      RETURNING id
                                  `;
                                  return client.query(vibeQuery, [vibe])
                                      .then(vibeResult => {
                                          const vibeId = vibeResult.rows[0].id;
                                          return client.query(
                                              'INSERT INTO "business_vibe" ("business_id", "vibe_id") VALUES ($1, $2)',
                                              [businessId, vibeId]
                                          ).then(() => businessId);
                                      });
                              } else {
                                  return Promise.resolve(businessId);
                              }
                          })
                          .then(businessId => {
                              // Insert diet
                              if (diet) {
                                  const dietQuery = `
                                      INSERT INTO "diet" ("name")
                                      VALUES ($1)
                                      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                                      RETURNING id
                                  `;
                                  return client.query(dietQuery, [diet])
                                      .then(dietResult => {
                                          const dietId = dietResult.rows[0].id;
                                          return client.query(
                                              'INSERT INTO "business_diet" ("business_id", "diet_id") VALUES ($1, $2)',
                                              [businessId, dietId]
                                          ).then(() => businessId);
                                      });
                              } else {
                                  return Promise.resolve(businessId);
                              }
                          })
                          .then(businessId => {
                              // Insert image URL
                              if (image_url) {
                                  return client.query(
                                      'INSERT INTO "business_image" ("business_id", "image_url") VALUES ($1, $2)',
                                      [businessId, image_url]
                                  ).then(() => businessId);
                              } else {
                                  return Promise.resolve(businessId);
                              }
                          })
                          .then(businessId => {
                              return client.query('COMMIT')
                                  .then(() => {
                                      client.release();
                                      res.status(200).json({ id: businessId, business_name, address, description, business_type, user_id, phone_number, vibe, diet, image_url });
                                  });
                          })
                          .catch(error => {
                              return client.query('ROLLBACK')
                                  .then(() => {
                                      client.release();
                                      console.log("error in POST bus route", error);
                                      res.status(500).json({ error: "An error occurred while adding the business" });
                                  });
                          });
                  })
                  .catch(error => {
                      client.query('ROLLBACK')
                          .then(() => {
                              client.release();
                              console.log("error in POST bus route", error);
                              res.status(500).json({ error: "An error occurred while adding the business" });
                          });
                  });
          })
          .catch(error => {
              console.log("error in connecting to the pool", error);
              res.status(500).json({ error: "An error occurred while connecting to the database" });
          });
  });
  

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