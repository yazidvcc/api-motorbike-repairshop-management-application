import userService from "../service/user-service.js";

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        
        // Set token in HttpOnly cookie
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({
            data: {
                username: result.username // Return only non-sensitive info if needed
            }
        })
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req.user.username);
        
        // Clear token cookie
        res.clearCookie('token');

        res.status(200).json({
            data: "OK"
        })
    } catch (error) {
        next(error)
    }
}

export default {
    login,
    logout
}