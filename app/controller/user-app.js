const User = require('../../model/User');
const ObjectId = require('mongodb').ObjectId; 
const createError = require('http-errors')
const generateJwt = require('../../config/generate-jwt');

const bcrypt = require('bcrypt');

const {registerValidation, loginValidation} = require('../validation/user-validation');
const { verify } = require('jsonwebtoken');

const formater = ($data, $msg) => {
    return $data
}

exports.index = async(req,res) => {
    const id = req.user._id

    var o_id = new ObjectId(id);
    const user =  await User.findOne({_id:o_id}).populate("role")

    res.send({
        status: 200,
        message : 'Sucess !',
        data : {
            user : user,
        }
     })
}


exports.register = async(req,res)=>{
    //validate request
    const {error} = registerValidation(req.body);
    if (error) res.json({ ErrorMessage: error.details[0].message });

    //check users
    // const emailExist = await User.find({ $or: [ { email: req.body.email }, { username: req.body.username } ]});
    // if(emailExist) return res.status(400).send('email or username already exist');

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        username : req.body.username,
        email : req.body.email,
        roles : req.body.roles,
        password : hashPassword,
        platform_id : req.body.platform_id,
    })
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(400).send(err);
    }
}


exports.login = async(req,res)=>{
    //validate request
    const {error} = loginValidation(req.body);
    if (error) res.json({ ErrorMessage: error.details[0].message });
    //check users
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('user not found');
    //validate password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('invalid password');

    //generate token
    // const token = jwt.sign(JSON.stringify({_id:user._id}), config.security.jwt)
    const token = generateJwt.generate(user._id)
    
    return res.status(200).json({ 
        status: 200,
        message : 'Login succesfully !',
        data : {
            user : {
                user,
                token : await(token)
            },
        } });
}

exports.refreshToken = async(req,res, next)=>{
    try {
        const refresh_token = req.header('refresh-token')
        if(!refresh_token) throw createError.UnprocessableEntity()

        const userId = await generateJwt.verifyRefreshToken(refresh_token)
        const token = generateJwt.generate(userId)

        res.send({
            status: 200,
            message : 'New Token Generated !',
            data : {
                token : (await token)
            }
        })

    } catch (err) {
        next(err)
    }
}

exports.logout = async(req,res, next)=>{
    try {
        const refresh_token = req.header('refresh-token')
        if(!refresh_token) throw createError.UnprocessableEntity()

        await generateJwt.revokeToken(refresh_token)

        res.send({
            status: 200,
            message : 'Logout Succesfully !'
        })

    } catch (err) {
        next(err)
    }
}
