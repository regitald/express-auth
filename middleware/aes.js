const CryptoJS = require("crypto-js");
const redis = require("redis");
const config = require("../config/config");

const client = redis.createClient(config.redis.port);

client.on("error", (err) => {
    console.log(err);
});


const verifyAES = (req,res,next)=>{
    client.get('service_user', (err, service_user) => {
        if (err) throw err;
        try { 
            console.log(service_user);
            console.log(req.header('basic'));
            const decrypted = CryptoJS.AES.decrypt(req.header('basic'), service_user);
            const object = decrypted.toString(CryptoJS.enc.Utf8);
            if(!object) return res.status(401).send("Invalid Authorization Basic Token");
            
            next()
        }catch (err) {

            return res.status(401).send("Invalid Authorization Basic Token");
        }
      });
  }

  
  module.exports = verifyAES;