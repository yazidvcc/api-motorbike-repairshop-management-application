import { totalmem, type } from "os"
import prismaClient from "../application/database.js"
import ResponseError from "../error/response-error.js"
import { createOrderValidation, idOrderValidation, searchOrderValidation } from "../validation/order-validation.js"
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

const search = async (request) => {

    request = validate(searchOrderValidation, request)

    const skip = (request.page - 1) * request.size

    const filters = [
        {
            type: {
                equals: request.type
            }
        },
        {
            date: {
                gte: request.date_start,
                lte: request.date_end
            }
        }
    ]

    if (request.service_description) {
        filters.push({
            service_description: {
                contains: request.service_description
            }
        })
    }

    if (request.name_mechanic) {
        filters.push({
            mechanic: {
                name: {
                    contains: request.name_mechanic
                }
            }
        })
    }

    const [orders, count] = await prismaClient.$transaction([
        prismaClient.order.findMany({
            where: {
                AND: filters
            },
            skip: skip,
            take: request.size,
            orderBy: {
                date: "desc"
            },
            select: {
                id: true,
                type: true,
                date: true,
                total_part: true,
                total_service: true,
                service_description: true,
                mechanic: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                orderDetail: {
                    select: {
                        item: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        quantity: true
                    }
                }
            }
        }),
        prismaClient.order.count({
            where: {
                AND: filters
            }
        })
    ])

    return {
        data: orders,
        paging: {
            page: request.page,
            total_item: count,
            total_page: Math.ceil(count / request.size)
        }
    }
}

const get = async (orderId) => {
    
    orderId = validate(idOrderValidation, orderId)

    const order = await prismaClient.order.findUnique({
        where: {
            id: orderId
        },
        select: {
            id: true,
            type: true,
            date: true,
            total_part: true,
            total_service: true,
            service_description: true,
            mechanic: {
                select: {
                    id: true,
                    name: true
                }
            },
            orderDetail: {
                select: {
                    item: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    quantity: true
                }
            }
        }
    })

    if (!order) {
        throw new ResponseError(404, "Order not found")
    }

    return order
}

export default {
    create,
    search,
    get
}