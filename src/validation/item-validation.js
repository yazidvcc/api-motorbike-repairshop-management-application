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

const searchItemValidation = Joi.object({
    name: Joi.string().max(100).optional(),
    page: Joi.number().min(1).default(1).optional(),
    size: Joi.number().min(1).max(100).default(10).optional()
}) 

const createItemPhotoValidation = Joi.object({
    id: Joi.number().required(),
    photo: Joi.string().regex(/\.(jpg|jpeg|png|gif|webp)$/).required()
})

const idItemValidation = Joi.number().required()

export {
    createItemValidation,
    updateItemValidation,
    idItemValidation,
    createItemPhotoValidation,
    searchItemValidation
}