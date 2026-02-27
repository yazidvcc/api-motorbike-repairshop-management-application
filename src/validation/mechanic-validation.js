import Joi from "joi"

const createMechanicValidation = Joi.object({
    name: Joi.string().max(100).regex(/^[a-zA-Z ]+$/).required(),
    phone: Joi.string().max(20).regex(/^[0-9]+$/).optional(),
    address: Joi.string().max(255).optional(),
})



export {
    createMechanicValidation
}