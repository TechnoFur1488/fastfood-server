import Cart from "../models/cart.model.js"
import CartItem from "../models/cart.item.model.js"
import Order from "../models/order.model.js"
import OrderItem from "../models/order.item.model.js"
import Product from "../models/product.model.js"

class OrderController {
    async createOrder(req, res) {
        const { adres, phone } = req.body
        const userId = req.user.id

        if (!adres || !phone) {
            return res.status(400).json({ message: "Адрес и номер телефона не могут быть пустыми" })
        }

        try {
            const cart = await Cart.findOne({ where: { userId } })

            const cartProduct = await CartItem.findAll({ where: { cartId: cart.id } })

            if (!cartProduct || cartProduct.length === 0) {
                return res.status(400).json({ message: "Корзина пуста" })
            }

            const totalPrice = cartProduct.reduce((sum, i) => sum + i.price, 0)
            const totalDiscount = cartProduct.reduce((sum, i) => sum + i.discount, 0)

            const order = await Order.create({ adres, phone, totalPrice, totalDiscount, userId })

            for (const item of cartProduct) {
                await OrderItem.create({ orderId: order.id, name: item.name, productId: item.productId, quantity: item.quantity, price: item.price, discount: item.discount })

                const product = await Product.findOne({ where: { id: item.productId } })
                if (product) {
                    await Product.update({ totalBuy: product.totalBuy + item.quantity }, { where: { id: item.productId } })
                }
            }

            await CartItem.destroy({ where: { cartId: cart.id } })

            return res.status(200).json({ message: "Заказ успешно создан" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка при создании заказа" })
        }
    }
}

export default new OrderController()