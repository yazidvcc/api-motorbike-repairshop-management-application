import Joi from "joi";

const loginUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required()
})

export {
    loginUserValidation
}