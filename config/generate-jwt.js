const config = require('../config/config')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./redis')

const generate = async(userId) => {
    //generate access token and refresh token
    const accessToken =  jwt.sign({_id:userId}, config.security.jwt, { expiresIn: '30s' });
    const refreshToken =  jwt.sign({_id:userId}, config.security.refresh_jwt);
    
    //set refresh token to redis
    client.set(`${userId}`, `${refreshToken}`,(err, replay) => {
        if(err) return console.log(err)
    })

    //return token as an object
    const generated_token = {
        'token': accessToken,
        'refresh_token': refreshToken
    }
    return generated_token
}

const verifyRefreshToken = (refreshToken) => {
    //make callbacks using promise to verify refresh token
    return new Promise((resolve, reject) => {
        //verify refresh token
        jwt.verify(refreshToken, config.security.refresh_jwt, (err,payload) => {
            //check if token not valid
            if(err)  return reject(createError.Unauthorized())
            //get user id from payload and check if user id exist in redis
            client.GET(payload._id, (err, result) => {
                if (err) {
                    return reject(createError.InternalServerError())
                }
                //retun resolve is process success
                if (refreshToken == result) return resolve(userId)

                //return unatorized if process fail
                return reject(createError.Unauthorized())
            })
        })
    })
}

const revokeToken = (refreshToken) => {
    //make callback promise to revoke token
    return new Promise((resolve, reject) => {
        //verify refresh token
        jwt.verify(refreshToken, config.security.refresh_jwt, (err,payload) => {
            //check if token not valid
            if(err)  return reject(createError.Unauthorized())

            //get user id from payload and check if user id exist in redis
            client.DEL(payload._id, (err, response) => {
                //return resolve success if action is success
                if (response == 1) return resolve(userId)
                // return unatorized if process fail
                return reject(createError.Unauthorized())
            })
        })
    })
}

module.exports = {
    generate,
    verifyRefreshToken,
    revokeToken
}