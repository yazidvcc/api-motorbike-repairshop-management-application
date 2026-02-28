import prismaClient from "../application/database"
import ResponseError from "../error/response-error"
import validate from "../validation/validation"
import { v4 as uuid } from "uuid"
import { depth } from "../application/depht"
import { createMechanicValidation, createMechanicPhotoValidation, searchMechanicValidation, updateMechaniceValidation } from "../validation/mechanic-validation"


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

    await request.mv(__dirname + `/../../storage/mechanic/${fileNamed}`)

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


export default {
    create,
    photo
}