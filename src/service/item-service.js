import prismaClient from "../application/database.js"
import validate from "../validation/validation.js"
import ResponseError from "../error/response-error.js"
import path from "path"
import { v4 as uuid } from "uuid"
import { createItemValidation, updateItemValidation, idItemValidation,  searchItemValidation, createItemPhotoValidation } from "../validation/item-validation.js"


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

const get = async (itemId) => {

    itemId = validate(idItemValidation, itemId)

    const item = await prismaClient.item.findUnique({
        where: {
            id: itemId
        },
        select: {
            id: true,
            name: true,
            price: true,
            stock: true
        }
    })

    if(!item) {
        throw new ResponseError(404, "Item not found")
    }

    return item
    
}

const remove = async (itemId) => {
    
    itemId = validate(idItemValidation, itemId)

    const item = await prismaClient.item.findUnique({
        where: {
            id: itemId
        }
    })

    if(!item) {
        throw new ResponseError(404, "Item not found")
    }

    return prismaClient.item.delete({
        where: {
            id: itemId
        }
    })
}

const search = async (request) => {
    
    request = validate(searchItemValidation, request)

    const skip = (request.page - 1) * request.size

    const filters = [
        {
            name: {
                contains: request.name
            }
        }
    ]

    const items = await prismaClient.item.findMany({
        where: {
            AND: filters
        },
        skip: skip,
        take: request.size,
        orderBy: {
            name: "asc"
        }
    })   
    
    const count = await prismaClient.item.count({
        where: {
            AND: filters
        }
    })
    
    return {
        data: items,
        paging: {
            page: request.page,
            total_item: count,
            total_page: Math.ceil(count / request.size)
        }
    }
    
}

const photo = async (itemId, request) => {

    const item = validate(createItemPhotoValidation, {
        id: itemId,
        photo: request.name
    })

    const countInDatabase = await prismaClient.item.count({
        where: {
            id: item.id
        }
    })

    if (countInDatabase === 0) {
        throw new ResponseError(404, "Item not found")
    }

    const fileName = `${item.id}${uuid().toString().replace(/-/g, "")}.${request.name.split(".").pop()}`

    const storagePath = path.resolve(__dirname, "../../storage/item", fileName)

    await request.mv(storagePath)

    return prismaClient.item.update({
        where: {
            id: item.id
        },
        data: {
            photo: fileName
        },
        select: {
            id: true,
            photo: true
        }
    })

}

const getPhoto = async (itemId) => {

    itemId = validate(idItemValidation, itemId)

    const item = await prismaClient.item.findUnique({
        where: {
            id: itemId
        }
    })

    if(!item) {
        throw new ResponseError(404, "Item not found")
    }

    if (!item.photo) {
        return path.resolve(__dirname, "../../storage/item/not-found.png")
    }

    return path.resolve(__dirname, "../../storage/item", item.photo)
}

export default {
    create,
    update,
    get,
    remove,
    search,
    photo,
    getPhoto
}