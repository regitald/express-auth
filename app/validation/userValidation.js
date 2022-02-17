//validation
const Joi = require('@hapi/joi')

//register validation
const registerValidation = (data) => {
    const schema = Joi.object({
        firstname : Joi.string()
            .min(4)
            .required(),
        lastname : Joi.string()
            .min(4),
        username : Joi.string()
            .min(8)
            .required(),
        email : Joi.string()
            .min(6)
            .required()
            .email(),
        roles : Joi.number(),
        password : Joi.string()
            .min(8)
            .required(),
        password_confirmation : Joi.any().valid(Joi.ref('password')).required()
    }); 
    return schema.validate(data);
};
const loginValidation = (data) => {
    const schema = Joi.object({
        email : Joi.string()
            .min(6)
            .required()
            .email(),
        password : Joi.string()
            .min(8)
            .required(),
    }); 
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation

