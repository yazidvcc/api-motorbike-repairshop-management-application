import jwt from "jsonwebtoken"
import ResponseError from "../error/response-error.js"
import prismaClient from "../application/database.js"

const authMiddleware = async (req, res, next) => {

    const token = req.get("Authorization")

    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end()
    }

    const tokenValue = token.split(" ")[1]

    jwt.verify(tokenValue, process.env.APP_SECRET, async (err, decoded) => {

        if (err) {
            res.status(401).json({
                errors: "Unauthorized"
            }).end()
        }

        const user = await prismaClient.user.findUnique({
            where: {
                token: decoded.credential
            },
            select: {
                id: true,
                username: true
            }
        })

        if (!user) {
            res.status(401).json({
                errors: "Unauthorized"
            }).end()
        }

        req.user = user
        next()
    })

}

export default authMiddleware;