const mongoose = require ('mongoose');

const followersSchema = new mongoose.Schema({
    following_id: {
        type : numeric,
        required : true
    },
    follower_id: {
        type : numeric,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Followers', followersSchema)