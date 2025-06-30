import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"

class UserController {
    async signup(req, res) {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Поля не могут быть пустыми" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Пароль должен быть не менее 6 символов" })
        }

        try {
            const user = await User.findOne({ where: { email } })

            if (user) {
                return res.status(400).json({ message: "Пользователь с таким email уже существует" })
            }

            const salt = await bcrypt.genSalt(10)
            const handlePassword = await bcrypt.hash(password, salt)

            const newUser = await User.create({ name, email, password: handlePassword })

            generateToken(newUser.id, newUser.role, res)

            const signupUser = await User.findByPk(newUser.id, { attributes: { exclude: ["password"] } })

            return res.status(201).json({ signupUser })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при создании пользователя" })
        }
    }

    async signin(req, res) {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Поля не могут быть пустыми" })
        }

        try {
            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" })
            }

            const isPassword = await bcrypt.compare(password, user.password)

            if (!isPassword) {
                return res.status(400).json({ message: "Неверный пароль" })
            }

            generateToken(user.id, user.role, res)

            const signinUser = await User.findByPk(user.id, { attributes: { exclude: ["password"] } })

            return res.status(200).json({ signinUser })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при авторизации пользователя" })
        }
    }

    async getRole(req, res) {
        return res.status(200).json({ role: req.user.role })
    }

}

export default new UserController()