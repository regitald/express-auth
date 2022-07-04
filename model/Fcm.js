const mongoose = require ('mongoose');
let mongooseHidden = require('mongoose-hidden')()

const roleSchema = new mongoose.Schema({
    user_id: {
        type :Number,
        default :null,
    },
    fcm: {
        type : String,
        required : true,
    },
    platform_id: {
        type :Number,
        default :null,
    }
});

roleSchema.plugin(mongooseHidden)

module.exports = mongoose.model('Role', roleSchema)