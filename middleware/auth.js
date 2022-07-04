const jwt = require("jsonwebtoken");
const config = require('../config/config');

const catchError = (err,res) => {
  if(err instanceof jwt.TokenExpiredError){
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }
  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] ||  req.header('auth-token');

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.security.jwt)
    req.user = decoded;
  } catch (err) {
    return catchError(err,res)
  }
  return next();
};

module.exports = verifyToken;