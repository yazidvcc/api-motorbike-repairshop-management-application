import validate from "../validation/validation.js"
import { loginUserValidation } from "../validation/user-validation.js"
import prismaClient from "../application/database.js"
import bcrypt from "bcrypt"
import ResponseError from "../error/response-error.js"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"

const login = async (request) => {

    const loginRequest = validate(loginUserValidation, request)

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    })

    if (!user) {
        throw new ResponseError(401, "Username or password is wrong")
    }

    const isPasswordMatch = await bcrypt.compare(loginRequest.password, user.password)

    if (!isPasswordMatch) {
        throw new ResponseError(401, "username or password is wrong")
    }

    const credential = uuid().toString();

    await prismaClient.user.update({
        data: {
            token: credential
        },
        where: {
            username: user.username
        }
    })

    const token = jwt.sign({ credential: credential }, process.env.APP_SECRET, {
        expiresIn: "1d"
    })

    return {
        token: token
    }

}

const logout = async (username) => {
    await prismaClient.user.update({
        data: {
            token: null
        },
        where: {
            username: username
        }
    })
    return "OK"
}


export default {
    login,
    logout
}