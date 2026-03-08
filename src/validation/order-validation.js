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

export {
    createOrderValidation
}