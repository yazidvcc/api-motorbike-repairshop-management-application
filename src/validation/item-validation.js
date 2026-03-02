import Joi from "joi";

const createItemValidation = Joi.object({
    name: Joi.string().max(100).required(),
    price: Joi.number().required(),
    stock: Joi.number().required()
})


export {
    createItemValidation
}