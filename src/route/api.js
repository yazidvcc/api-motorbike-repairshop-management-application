import express from "express"
import authMiddleware from "../middleware/auth-middleware"
import userController from "../controller/user-controller"
import mechanicController from "../controller/mechanic-controller"

const userRouter = new express.Router()

userRouter.use(authMiddleware)
userRouter.post("/api/users/logout", userController.logout)


export default userRouter;