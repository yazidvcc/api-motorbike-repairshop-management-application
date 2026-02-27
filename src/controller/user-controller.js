import userService from "../service/user-service.js";

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        const result = await userService.logout(req.user.username);
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export default {
    login,
    logout
}