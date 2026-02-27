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

export default {
    create
}