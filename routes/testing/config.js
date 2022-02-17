const express = require ('express');
const axios = require("axios");
const redis = require("redis");

const router = express.Router();
const redisPort = 6379
const client = redis.createClient(redisPort);

const USERS_API = 'https://jsonplaceholder.typicode.com/users/';

client.on("error", (err) => {
    console.log(err);
});

router.get("/response", (req, res) => {
    try {
        axios.get(`${USERS_API}`).then(function (response) {
          const users = response.data;
          console.log('Users retrieved from the API');
          res.status(200).send(users);
        });
      } catch (err) {
        res.status(500).send({ error: err.message });
      }    
});
router.get('/cached', (req, res) => {

    try {
      client.get('users', async(err, data) => {
  
        if (err) {
          console.error(err);
          throw err;
        }
  
        if (data) {
          console.log('Users retrieved from Redis');
          const responseRedis = JSON.parse(data);
          res.status(200).send(responseRedis);
        } else {
            await axios.get(`${USERS_API}`).then(function (response) {
            const users = response.data;
            client.setex('users', 600, JSON.stringify(users));
            console.log('Users retrieved from the API');
            res.status(200).send(users);
          });
        }
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });


module.exports = router