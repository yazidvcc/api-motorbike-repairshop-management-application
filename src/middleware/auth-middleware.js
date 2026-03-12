import jwt from "jsonwebtoken"
import ResponseError from "../error/response-error.js"
import prismaClient from "../application/database.js"

const authMiddleware = async (req, res, next) => {

    let token = req.cookies.token;
    
    if (!token) {
        const authHeader = req.get("Authorization");
        if (authHeader) {
            token = authHeader.split(" ")[1];
        }
    }

    if (!token) {
        return res.status(401).json({
            errors: "Unauthorized"
        }).end()
    }

    const tokenValue = token;

    jwt.verify(tokenValue, process.env.APP_SECRET, async (err, decoded) => {

        if (err) {
            return res.status(401).json({
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
            return res.status(401).json({
                errors: "Unauthorized"
            }).end()
        }

        req.user = user
        next()
    })

}

export default authMiddleware;