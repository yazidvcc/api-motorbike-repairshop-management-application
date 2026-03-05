import itemService from "../service/item-service.js"

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

const get = async (req, res, next) => {
    try {
        const itemId = req.params.itemId

        const result = await itemService.get(itemId)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const itemId = req.params.itemId

        const result = await itemService.remove(itemId)
        res.status(200).json({
            data: "OK"
        })
    } catch (e) {
        next(e)
    }
}

const search = async (req, res, next) => {
    try {
        const request = {
            name: req.query.name,
            page: req.query.page,
            size: req.query.size
        }

        const result = await itemService.search(request)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const photo = async (req, res, next) => {
    try {
        const result = await itemService.photo(req.params.itemId, req.files.photo)
        res.status(201).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const getPhoto = async (req, res, next) => {
    try {
        const result = await itemService.getPhoto(req.params.itemId)
        res.status(200).sendFile(result)
    } catch (e) {
        next(e)
    }
}


export default {
    create,
    update,
    get,
    remove,
    search,
    photo,
    getPhoto
}