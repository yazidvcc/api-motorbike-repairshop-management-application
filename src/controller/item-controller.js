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

const update = async (req, res, next) => {
    try {
        const request = req.body
        request.id = req.params.itemId

        const result = await itemService.update(request)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}


export default {
    create,
    update
}