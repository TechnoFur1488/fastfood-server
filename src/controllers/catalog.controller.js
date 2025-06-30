import CartItem from "../models/cart.item.model.js"
import Catalog from "../models/catalog.model.js"
import Product from "../models/product.model.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


class CatalogController {

    async createCatalog(req, res) {
        const { name } = req.body

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав для создания продукта" })
        }

        if (!name) {
            return res.status(400).json({ message: "Название каталога не может быть пустым" })
        }

        try {
            const catalog = await Catalog.create({ name })

            return res.status(201).json(catalog)
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при создании каталога" })
        }
    }

    async getAllCatalog(req, res) {
        try {
            const catalog = await Catalog.findAll()
            return res.status(200).json({ catalog })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при получении всех каталогов" })
        }
    }

    async getOneCatalog(req, res) {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "ID каталога не может быть пустым" })
        }

        try {
            const catalog = await Catalog.findByPk(id)

            if (!catalog) {
                return res.status(404).json({ message: "Каталог не найден" })
            }

            return res.status(200).json({ catalog })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при получении каталога" })
        }
    }

    async getProdutcByCatalog(req, res) {
        const { id } = req.params
        const { page = 1 } = req.query
        const limit = 10

        if (!id) {
            return res.status(400).json({ message: "ID каталога не может быть пустым" })
        }

        try {
            const catalog = await Catalog.findByPk(id)

            if (!catalog) {
                return res.status(404).json({ message: "Каталог не найден" })
            }

            const offset = (page - 1) * limit

            const product = await Product.findAndCountAll({ limit, offset, where: { catalogId: id } })

            return res.status(200).json({ product })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при получении продуктов" })
        }
    }

    async updateCatalog(req, res) {
        const { id } = req.params
        const { name } = req.body

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав для создания продукта" })
        }

        if (!id) {
            return res.status(400).json({ message: "ID каталога не может быть пустым" })
        }

        if (!name) {
            return res.status(400).json({ message: "Название каталога не может быть пустым" })
        }

        try {
            const catalog = await Catalog.findByPk(id)

            if (!catalog) {
                return res.status(404).json({ message: "Каталог не найден" })
            }

            await Catalog.update({ name }, { where: { id } })

            const catalogUpdate = await Catalog.findByPk(id)

            return res.status(200).json({ catalogUpdate })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при обновлении каталога" })
        }
    }

    async deleteCatalog(req, res) {
        const { id } = req.params

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав для создания продукта" })
        }

        if (!id) {
            return res.status(400).json({ message: "ID каталога не может быть пустым" })
        }

        try {
            const catalog = await Catalog.findByPk(id, {
                include: [{
                    model: Product,
                    as: "Products"
                }]
            })

            if (!catalog) {
                return res.status(404).json({ message: "Каталог не найден" })
            }

            const allFile = [
                ...(catalog.Products?.flatMap(product => product.img) || [])
            ]

            await Promise.all(allFile.map(async (fileName) => {
                const filePath = path.resolve(__dirname, "..", "..", "static", fileName)
                await fs.promises.unlink(filePath)
            }))

            const products = await Product.findAll({ where: { catalogId: id }, attributes: ["id"] })

            const productIds = products.map(p => p.id)

            if (productIds.length > 0) {
                await CartItem.destroy({ where: { productId: productIds } })
            }

            await Product.destroy({ where: { catalogId: id } })

            await Catalog.destroy({ where: { id } })

            return res.status(200).json({ message: "Каталог успешно удален" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при удалении каталога" })
        }
    }

}

export default new CatalogController()