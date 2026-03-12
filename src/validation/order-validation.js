import Joi from "joi"

const createOrderValidation = Joi.object({
    type: Joi.string().valid("transaction", "services").required(),
    total_service: Joi.number().when("type", { is: "services", then: Joi.required() }),
    service_description: Joi.string().when("type", { is: "services", then: Joi.required() }),
    mechanic_id: Joi.number().when("type", { is: "services", then: Joi.required() }),
    items: Joi.array().items(Joi.object({
        item_id: Joi.number().required(),
        quantity: Joi.number().required()
    })).optional()
})

const searchOrderValidation = Joi.object({
    type: Joi.string().valid("transaction", "services").optional(),
    date_start: Joi.date().default(new Date("1970-01-01 00:00:00")).optional(),
    date_end: Joi.date().default(new Date("2099-12-31 00:00:00")).optional(),
    service_description: Joi.string().optional(),
    name_mechanic: Joi.string().optional(),
    page: Joi.number().min(1).default(1).optional(),
    size: Joi.number().min(1).max(100).default(10).optional()
})

const idOrderValidation = Joi.number().required()

export {
    createOrderValidation,
    searchOrderValidation,
    idOrderValidation
}