const config = require('../../config/config');
const User = require('../../model/User');
const ObjectId = require('mongodb').ObjectId; 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {registerValidation, loginValidation} = require('../validation/userValidation');

exports.formater = ($data, $msg) => {
    return $data
}

exports.index = async(req,res) => {
    const id = req.user._id

    var o_id = new ObjectId(id);
    const user =  await User.findOne({_id:o_id}).populate("role")

    res.send(this.formater(user, 'success'))
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
    const token = jwt.sign(JSON.stringify({_id:user._id}), config.security.jwt)

    res.send({
        status: 200,
        message : 'Login succesfully !',
        data : {
            user : user,
            token : token
        }
     })
}
