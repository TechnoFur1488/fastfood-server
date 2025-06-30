import Cart from "../models/cart.model.js"
import Product from "../models/product.model.js"
import CartItem from "../models/cart.item.model.js"

class CartController {
    async addCart(req, res) {
        const { productId } = req.params
        const quantity = 1

        if (!productId) {
            return res.status(400).json({ message: "ID продукта не может быть пустым" })
        }

        try {
            const product = await Product.findByPk(productId)

            if (!product) {
                return res.status(404).json({ message: "Продукт не найден" })
            }

            const cartUser = await Cart.findOne({ where: { userId: req.user.id } })

            if (!cartUser) {
                await Cart.create({ userId: req.user.id })
            }

            const cartProduct = await CartItem.findOne({where: { cartId: cartUser.id, productId }})

            if (cartProduct) {
                return res.status(400).json({ message: "Товар уже добавлен в корзину" })
            }
        
            const totalPrice = product.price * quantity

            const cartItem = await CartItem.create({ name: product.name, quantity: quantity, price: totalPrice, img: product.img, productId, cartId: cartUser.id, discount: product.discount })

            return res.status(200).json({ cartItem })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при добавлении продукта в корзину" })
        }
    }

    async getCart(req, res) {
        const userId = req.user.id

        try {
            const cartUser = await Cart.findOne({ where: { userId } })

            if (!cartUser) {
                await Cart.create({ userId })
            }

            const cartItem = await CartItem.findAll({ where: { cartId: cartUser.id }, order: [["createdAt", "DESC"]] })

            return res.status(200).json({ cartItem })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при получении корзины" })
        }
    }

    async updateCart(req, res) {
        const { id } = req.params
        const { quantity } = req.body

        if (!id) {
            return res.status(400).json({ message: "ID продукта не может быть пустым" })
        }

        if (!quantity) {
            return res.status(400).json({ message: "Количество продукта не может быть пустым" })
        }

        try {
            const cartItem = await CartItem.findByPk(id)

            if (!cartItem) {
                return res.status(404).json({ message: "Продукт не найден" })
            }

            const product = await Product.findOne({ where: { id: cartItem.productId } })

            const priceTotal = quantity * product.price
            const discountTotal = quantity * product.discount

            await CartItem.update({ quantity, price: priceTotal, discount: discountTotal }, { where: { id } })

            const updateCartProduct = await CartItem.findByPk(id)

            return res.status(200).json({ updateCartProduct })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при обновлении продукта в корзине" })
        }
    }

    async deleteCart(req, res) {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "ID продукта не может быть пустым" })
        }

        try {
            const cartItem = await CartItem.findByPk(id)

            if (!cartItem) {
                return res.status(404).json({ message: "Продукт не найден" })
            }

            await cartItem.destroy({ where: { id } })

            return res.status(200).json({ message: "Продукт успешно удален из корзины" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при удалении продукта из корзины" })
        }
    }
}

export default new CartController()