import itemService from "../service/item-service"

const create = async (req, res, next) => {
    try {
        const result = await itemService.create(req.body)
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