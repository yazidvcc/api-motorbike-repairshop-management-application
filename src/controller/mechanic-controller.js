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

const photo = async (req, res, next) => {
    try {
        const result = await mechanicService.photo(req.params.mechanicId, req.files.photo)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const search = async (req, res, next) => {
    try {
        const request = {
            name: req.query.name,
            phone: req.query.phone,
            address: req.query.address,
            page: req.query.page,
            size: req.query.size,
        }

        const result = await mechanicService.search(request)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const request = req.body
        request.id = req.params.mechanicId
        const result = await mechanicService.update(request)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await mechanicService.remove(req.params.mechanicId)
        res.status(200).json({
            data: "Success remove mechanic"
        })
    } catch (e) {
        next(e)
    }
}

const getPhoto = async (req, res, next) => {
    try {
        const path = await mechanicService.getPhoto(req.params.mechanicId)
        res.status(200).sendFile(path)
    } catch (e) {
        next(e)
    }
}

export default {
    create,
    photo,
    search,
    update,
    remove,
    getPhoto
}