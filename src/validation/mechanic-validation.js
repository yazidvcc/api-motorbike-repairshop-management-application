import Joi from "joi"

const createMechanicValidation = Joi.object({
    name: Joi.string().max(100).regex(/^[a-zA-Z ]+$/).required(),
    phone: Joi.string().max(20).regex(/^[0-9]+$/).optional(),
    address: Joi.string().max(255).optional(),
})

const createMechanicPhotoValidation = Joi.object({
    id: Joi.number().required(),
    photo: Joi.string().regex(/\.(jpg|jpeg|png|gif|webp)$/).required()
})

const searchMechanicValidation = Joi.object({
    name: Joi.string().max(100).regex(/^[a-zA-Z ]+$/).default("").optional(),
    phone: Joi.string().max(20).regex(/^[0-9]+$/).default("").optional(),
    address: Joi.string().max(255).default("").optional(),
    page: Joi.number().min(1).default(1).optional(),
    size: Joi.number().min(1).max(100).default(10).optional()
})

export {
    createMechanicValidation,
    createMechanicPhotoValidation
}