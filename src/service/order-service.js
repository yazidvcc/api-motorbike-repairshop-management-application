import prismaClient from "../application/database.js"
import ResponseError from "../error/response-error.js"
import { createOrderValidation } from "../validation/order-validation.js"
import validate from "../validation/validation.js"

const create = async (request) => {

    request = validate(createOrderValidation, request)

    return prismaClient.$transaction(async () => {

        if (request.type === "services") {
            const mechanic = await prismaClient.mechanic.findUnique({
                where: {
                    id: request.mechanic_id
                }
            })

            if (!mechanic) {
                throw new ResponseError(404, "Mechanic not found")
            }
        }

        const items = await prismaClient.item.findMany({
            where: {
                id: {
                    in: request.items.map(item => item.item_id)
                }
            }
        })

        if (items.length !== request.items.length) {
            throw new ResponseError(404, "Item not found")
        }

        let total_part = 0

        items.map((item, index) => {
            if (item.stock < request.items[index].quantity) {
                throw new ResponseError(400, `Item ${item.name} stock is not enough`)
            }
            total_part += request.items[index].quantity * item.price
        })

        request.total_part = total_part

        request.orderDetail = {
            createMany: {
                data: request.items
            }
        }

        request.items = undefined

        return prismaClient.order.create({
            data: request,
            include: {
                orderDetail: true
            }
        })
    })


}

export default {
    create
}