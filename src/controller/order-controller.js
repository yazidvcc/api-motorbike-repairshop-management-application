import orderService from "../service/order-service.js"

const create = async (req, res, next) => {
    try {
        const result = await orderService.create(req.body)
        res.status(201).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const search = async (req, res, next) => {
    try {
        const result = await orderService.search(req.query)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await orderService.get(req.params.orderId)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await orderService.remove(req.params.orderId)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

export default {
    create,
    search,
    get,
    remove
}