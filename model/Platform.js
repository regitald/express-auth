const mongoose = require ('mongoose');
let mongooseHidden = require('mongoose-hidden')()

const roleSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        max : 255,
        min : 4
    },
    application_key: {
        type : String,
        required : true,
    },
    type: {
        type : String,
        enum : ['mobile','ios','web','other'],
        default :'other',
        hide : true,
    },
    date : {
        type : Date,
        default : Date.now
    }
});

roleSchema.plugin(mongooseHidden)

module.exports = mongoose.model('Role', roleSchema)