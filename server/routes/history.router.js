const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {rejectUnauthenticated} = require('../modules/authentication-middleware');


router.get('/', rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT * FROM user_profile`;
    pool
      .query(sqlText)
      .then((result) => {
        console.log(`GET from database`, result.rows);
        res.send(result.rows);
      })
      .catch((error) => {
        console.log(`Error making database query ${sqlText}`, error);
        res.sendStatus(500);
      });
  }); 


  router.post('/', rejectUnauthenticated, (req, res) => {
    const {search_history} = req.body;
    let sqlText = `
      INSERT INTO "user_profile"
      ("user_id", "search_history")
      VALUES
      ($1, $2)
    `;
    const values = [req.user.id, search_history];
    pool
      .query(sqlText, values)
      .then(() => {
        console.log('POST successful'); 
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log('Error making POST', error);
        res.sendStatus(500);
      });
  });


module.exports = router;