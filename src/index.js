import express from "express"
import sequelize from "./lib/db.js"
import cookieParser from "cookie-parser"
import "./models/model.js"
import router from "./routes/routes.js"
import fileUpload from "express-fileupload"
import { fileURLToPath } from "url"
import path, { dirname } from "path"
import cors from "cors"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const PORT = process.env.PORT
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, "..", "static")))
app.use(fileUpload())

app.use(cors({
    origin: ["https://fastfood-client-git-main-nikitas-projects-e30fe775.vercel.app", "https://fastfood-client-beta.vercel.app"],
    credentials: true,
}))

app.use("/api", router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`))
    } catch (err) {
        console.error(err)
    }
}

start()