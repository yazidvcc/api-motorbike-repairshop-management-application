import express from "express"
import userController from "../controller/user-controller.js"
import itemController from "../controller/item-controller.js"
import mechanicController from "../controller/mechanic-controller.js"

const publicRouter = new express.Router()

publicRouter.post('/api/users/login', userController.login)

publicRouter.get("/api/mechanics/:mechanicId/photo", mechanicController.getPhoto)
publicRouter.get("/api/items/:itemId/photo", itemController.getPhoto)

export default publicRouter