const dotenv = require ('dotenv');

dotenv.config();

const config = {
    app: {
      port: 1010
    },
    db: {
      connection_uri : `mongodb+srv://${process.env.DB_USER}:${process.env.DB_CREDENTIAL}@cluster0.qrvp0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    },
    security : {
        jwt : 'jwt_auth_secret'
    },
    redis : {
      port :6379
    }
};
   
module.exports = config;