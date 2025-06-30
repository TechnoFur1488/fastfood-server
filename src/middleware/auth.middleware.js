import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({ message: "Пользователь не авторизован" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "Пользователь не авторизован" })
        }

        const user = await User.findByPk(decoded.userId)

        if (!user) {
            return res.status(401).json({ message: "Пользователь не авторизован" })
        }

        req.user = user

        next()
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Произошла ошибка при авторизации пользователя" })
    }
}