import express from "express"
import authMiddleware from "../middleware/auth-middleware"
import userController from "../controller/user-controller"
import mechanicController from "../controller/mechanic-controller"

const userRouter = new express.Router()

userRouter.use(authMiddleware)
userRouter.post("/api/users/logout", userController.logout)
userRouter.get("/api/mechanics", mechanicController.search)
userRouter.put("/api/mechanics/:mechanicId", mechanicController.update)
userRouter.delete("/api/mechanics/:mechanicId", mechanicController.remove)
userRouter.post("/api/mechanics/:mechanicId/photo", mechanicController.photo)
userRouter.get("/api/mechanics/:mechanicId/photo", mechanicController.getPhoto)




export default userRouter;