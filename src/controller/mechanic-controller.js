import mechanicService from "../service/mechanic-service"
import userService from "../service/user-service"

const create = async (req, res, next) => {
    try {
        const result = await mechanicService.create(req.body)
        res.status(201).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export default {
    create
}