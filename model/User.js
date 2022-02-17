const mongoose = require ('mongoose');
let mongooseHidden = require('mongoose-hidden')()

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    firstname: {
        type : String,
        required : true,
        max : 255,
        min : 4
    },
    lastname: {
        type : String,
        max : 255,
        min : 4
    },
    username: {
        type : String,
        max : 255,
        min : 8
    },
    email: {
        type : String,
        required : true,
        max : 255,
        min : 4
    },
    password: {
        type : String,
        required : true,
        max: 1024,
        min : 8,
        hide : true,
    },
    roles: {
        type : Number,
        required : true,
    },
    status : {
        type : String,
        enum : ['active','inactive'],
        default :'inactive',
        hide : true,
    },
    level : {
        type : String,
        default :'-'
    }, 
    point : {
        type : Number,
        default :0
    },
    badges : {
        type : String,
        default :'-'
    },
    role : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Roles'
    },
    verified_at : {
        type :Date,
        default : null
    },
    platform_id : {
        type :Number,
        default :null,
        hide : true,
    },
    partner_id : {
        type :Number,
        default :null,
        hide : true,
    },
    reset_password_token : {
        type : String,
        default :null,
        hide : true,
    },
    date : {
        type : Date,
        default : Date.now
    }
});

userSchema.plugin(mongooseHidden)

module.exports = mongoose.model('User', userSchema)