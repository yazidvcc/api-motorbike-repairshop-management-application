import express from "express"
import authMiddleware from "../middleware/auth-middleware"
import userController from "../controller/user-controller"
import mechanicController from "../controller/mechanic-controller"
import itemController from "../controller/item-controller"

const userRouter = new express.Router()

userRouter.use(authMiddleware)

userRouter.post("/api/users/logout", userController.logout)

userRouter.post("/api/mechanics", mechanicController.create)
userRouter.get("/api/mechanics", mechanicController.search)
userRouter.put("/api/mechanics/:mechanicId", mechanicController.update)
userRouter.delete("/api/mechanics/:mechanicId", mechanicController.remove)
userRouter.post("/api/mechanics/:mechanicId/photo", mechanicController.photo)
userRouter.get("/api/mechanics/:mechanicId/photo", mechanicController.getPhoto)

userRouter.post("/api/items", itemController.create)
userRouter.get("/api/items/:itemId", itemController.get)
userRouter.put("/api/items/:itemId", itemController.update)


export default userRouter;