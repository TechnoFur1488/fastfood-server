import { v4 as uuidv4 } from "uuid"
import { fileURLToPath } from "url"
import path, { dirname } from "path"
import fs from "fs"
import Product from "../models/product.model.js"
import CartItem from "../models/cart.item.model.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class ProductController {
    async createPrduct(req, res) {
        const { name, description, price, discount, catalogId } = req.body
        const { img } = req.files

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав для создания продукта" })
        }

        if (!name || !description || !price || !discount || !catalogId) {
            return res.status(400).json({ message: "Поля не могут быть пустыми" })
        }

        if (!img) {
            return res.status(400).json({ message: "Изображение продукта не может быть пустым" })
        }

        try {
            let fielName = uuidv4() + ".webp"
            img.mv(path.resolve(__dirname, "..", "..", "static", fielName))

            const product = await Product.create({ name: name.trim(), description: description.trim(), price, img: fielName, catalogId, discount })

            return res.status(201).json(product)
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при создании продукта" })
        }

    }

    async getProductPopular(req, res) {
        const product = await Product.findAndCountAll({ limit: 5, order: [["totalBuy", "DESC"]] })
        return res.status(200).json({ product })
    }

    async getProductNew(req, res) {
        const product = await Product.findAndCountAll({ limit: 5, order: [["createdAt", "DESC"]] })
        return res.status(200).json({ product })
    }

    async updateProduct(req, res) {
        const { id } = req.params
        const { name, description, price, discount, catalogId } = req.body
        const { img } = req.files

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав для создания продукта" })
        }

        if (!id) {
            return res.status(400).json({ message: "ID продукта не может быть пустым" })
        }

        if (!name || !description || !price || !discount || !catalogId) {
            return res.status(400).json({ message: "Поля не могут быть пустыми" })
        }

        if (!img) {
            return res.status(400).json({ message: "Изображение продукта не может быть пустым" })
        }

        try {
            const product = await Product.findByPk(id)

            if (!product) {
                return res.status(404).json({ message: "Продукт не найден" })
            }

            if (product.img) {
                const filePath = path.resolve(__dirname, "..", "..", "static", product.img)
                await fs.promises.unlink(filePath)
            }

            let fileName = uuidv4() + ".webp"
            img.mv(path.resolve(__dirname, "..", "..", "static", fileName))

            const cartItem = await CartItem.findAll({ where: { productId: id } })

            if (cartItem.length > 0) {
                const totalPriceCartUser = price * cartItem.quantity

                await CartItem.update({ price: totalPriceCartUser }, { where: { productId: id } })
            }

            await Product.update({ name: name.trim(), description: description.trim(), price, discount, catalogId, img: fileName }, { where: { id } })

            const updateProduct = await Product.findByPk(id)

            return res.status(200).json({ updateProduct })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при обновлении продукта" })
        }

    }

    async deleteProduct(req, res) {
        const { id } = req.params

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав для создания продукта" })
        }

        if (!id) {
            return res.status(400).json({ message: "ID продукта не может быть пустым" })
        }

        try {
            const product = await Product.findByPk(id)

            if (!product) {
                return res.status(404).json({ message: "Продукт не найден" })
            }

            if (product.img) {
                const filePath = path.resolve(__dirname, "..", "..", "static", product.img)
                await fs.promises.unlink(filePath)
            }

            await Product.destroy({ where: { id } })

            return res.status(200).json({ message: "Продукт успешно удален" })
        } catch {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при удалении продукта" })
        }
    }
}

export default new ProductController()