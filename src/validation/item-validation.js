import Joi from "joi";

const createItemValidation = Joi.object({
    name: Joi.string().max(100).required(),
    price: Joi.number().required(),
    stock: Joi.number().required()
})

const updateItemValidation = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().max(100).optional(),
    price: Joi.number().optional(),
    stock: Joi.number().optional()
})

const idItemValidation = Joi.number().required()

export {
    createItemValidation,
    updateItemValidation,
    idItemValidation
}