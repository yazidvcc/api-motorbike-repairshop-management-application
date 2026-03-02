import prismaClient from "../application/database"
import validate from "../validation/validation"
import { createItemValidation } from "../validation/item-validation"
import ResponseError from "../error/response-error"

const create = async (request) => {
    
    request = validate(createItemValidation, request)

    const countInDatabase = await prismaClient.item.count({
        where: {
            name: {
                equals: request.name
            }
        }
    })

    if(countInDatabase > 0) {
        throw new ResponseError(400, "Item already exists")
    }

    return prismaClient.item.create({
        data: {
            name: request.name,
            price: request.price,
            stock: request.stock
        },
        select: {
            id: true,
            name: true,
            price: true,
            stock: true
        }
    })
}

export default {
    create
}