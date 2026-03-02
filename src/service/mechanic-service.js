import prismaClient from "../application/database"
import ResponseError from "../error/response-error"
import validate from "../validation/validation"
import { v4 as uuid } from "uuid"
import { depth } from "../application/depht"
import path from "path"
import { createMechanicValidation, createMechanicPhotoValidation, searchMechanicValidation, updateMechaniceValidation, deleteMechanicValidation, idMechanicValidation } from "../validation/mechanic-validation"


const create = async (request) => {

    const mechanic = validate(createMechanicValidation, request)

    return prismaClient.mechanic.create({
        data: mechanic,
        select: {
            id: true,
            name: true,
            phone: true,
            address: true
        }
    })

}

const photo = async (mechanicId, request) => {

    const mechanic = validate(createMechanicPhotoValidation, {
        id: mechanicId,
        photo: request.name
    })

    const countInDatabase = await prismaClient.mechanic.count({
        where: {
            id: {
                equals: mechanic.id
            }
        }
    })

    if (countInDatabase !== 1) {
        throw new ResponseError(404, "Mechanic not found")
    }

    const fileNamed = `${mechanic.id}${uuid().toString().replace(/-/g, "")}.${request.name.split(".").pop()}`

    const storagePath = path.resolve(__dirname, "../../storage/mechanic", fileNamed)
    await request.mv(storagePath)

    return prismaClient.mechanic.update({
        where: {
            id: mechanic.id
        },
        data: {
            photo: fileNamed
        },
        select: {
            id: true,
            photo: true
        }
    })

}

const search = async (request) => {

    request = validate(searchMechanicValidation, request)

    const skip = (request.page - 1) * request.size

    let filters = [
        {
            name: {
                contains: request.name
            }
        },
        {
            phone: {
                contains: request.phone
            }
        },
        {
            address: {
                contains: request.address
            }
        }
    ]

    const mechanics = await prismaClient.mechanic.findMany({
        where: {
            AND: filters
        },
        skip: skip,
        take: request.size,
        orderBy: {
            name: "asc"
        }
    })

    const count = await prismaClient.mechanic.count({
        where: {
            AND: filters
        },
    })

    return {
        data: mechanics,
        paging: {
            page: request.page,
            total_item: count,
            total_page: Math.ceil(count / request.size)
        }
    }

}

const update = async (request) => {

    const mechanic = validate(updateMechaniceValidation, request)

    const countInDatabase = await prismaClient.mechanic.count({
        where: {
            id: {
                equals: mechanic.id
            }
        }
    })

    if (countInDatabase !== 1) {
        throw new ResponseError(404, "Mechanic not found")
    }

    return prismaClient.mechanic.update({
        where: {
            id: mechanic.id
        },
        data: mechanic,
        select: {
            id: true,
            name: true,
            phone: true,
            address: true
        }
    })
}

const remove = async (mechanicId) => {

    mechanicId = validate(idMechanicValidation, mechanicId)

    const countInDatabase = await prismaClient.mechanic.count({
        where: {
            id: {
                equals: mechanicId
            }
        }
    })

    if (countInDatabase !== 1) {
        throw new ResponseError(404, "Mechanic not found")
    }

    return prismaClient.mechanic.delete({
        where: {
            id: mechanicId
        }
    })
}

const getPhoto = async (mechanicId) => {

    mechanicId = validate(idMechanicValidation, mechanicId)

    const mechanic = await prismaClient.mechanic.findUnique({
        where: {
            id: mechanicId
        }
    })

    if (!mechanic) {
        throw new ResponseError(404, "Mechanic not found")
    }

    if (!mechanic.photo) {
        return path.resolve(__dirname, "../../storage/mechanic/not-found.png")
    }

    return path.resolve(__dirname, "../../storage/mechanic", mechanic.photo)

}

export default {
    create,
    photo,
    search,
    update,
    remove,
    getPhoto
}