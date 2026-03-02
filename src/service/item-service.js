import prismaClient from "../application/database"
import validate from "../validation/validation"
import { createItemValidation, updateItemValidation } from "../validation/item-validation"
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

const update = async (request) => {
    
    request = validate(updateItemValidation, request)

    const countInDatabase = await prismaClient.item.count({
        where: {
            id: request.id
        }
    })

    if(countInDatabase === 0) {
        throw new ResponseError(404, "Item not found")
    }

    return prismaClient.item.update({
        data: request,
        where: {
            id: request.id
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
    create,
    update
}