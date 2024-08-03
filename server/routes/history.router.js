const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {rejectUnauthenticated} = require('../modules/authentication-middleware');


router.get('/', rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT up.id, up.search_history, b.id AS business_id, b.business_name, b.address
    FROM user_profile up
    LEFT JOIN business b ON b.business_name = up.search_history
    WHERE up.user_id = $1
    ORDER BY up.id DESC
  `;
  
  pool.query(queryText, [req.user.id])
    .then((result) => {
      console.log(`GET from database`, result.rows);
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error making database query ${queryText}`, error);
      res.sendStatus(500);
    });
});



  router.post('/', rejectUnauthenticated, (req, res) => {
    const { search_history } = req.body;
    const user_id = req.user.id;
  
    console.log('Received POST request:', { user_id, search_history });
  
    if (!user_id) {
      console.log('User ID is missing');
      return res.status(400).send('User ID is required');
    }
  
    let sqlText = `
      INSERT INTO "user_profile" ("user_id", "search_history")
      VALUES ($1, $2)
      ON CONFLICT (user_id) 
      DO UPDATE SET search_history = COALESCE(user_profile.search_history, '') || ', ' || EXCLUDED.search_history
    `;
  
    const values = [user_id, search_history];
  
    pool.query(sqlText, values)
      .then(() => {
        console.log('POST successful');
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error('Error making POST:', error);
        res.status(500).send(error.toString());
      });
  });

  router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const itemId = req.params.id;
    const userId = req.user.id;
    console.log(`Attempting to delete item ${itemId} for user ${userId}`);

    const queryText = `
    DELETE FROM "user_profile"
    WHERE "id" = $1 AND "user_id" = $2
    `
    pool.query(queryText, [itemId, userId])
    .then ((result) => {
      if (result.rowCount > 0) {
        res.sendStatus(204)
      } else {
        res.sendStatus(403)
      } 
    })
    .catch((error) => {
      console.log('Error with DELETE', error);
      res.sendStatus(500)
    })
});


module.exports = router;