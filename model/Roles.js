const mongoose = require ('mongoose');
let mongooseHidden = require('mongoose-hidden')()

const roleSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        max : 255,
        min : 4
    },
    date : {
        type : Date,
        default : Date.now
    },
    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref :"User"

    }]
});

roleSchema.plugin(mongooseHidden)

module.exports = mongoose.model('Role', roleSchema)