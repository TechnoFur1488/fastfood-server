import CartItem from "./cart.item.model.js";
import Cart from "./cart.model.js";
import Catalog from "./catalog.model.js";
import OrderItem from "./order.item.model.js";
import Order from "./order.model.js";
import Product from "./product.model.js";
import User from "./user.model.js";

User.hasOne(Cart)
Cart.belongsTo(User)

Cart.hasMany(CartItem)
CartItem.belongsTo(Cart)

Product.hasMany(CartItem)
CartItem.belongsTo(Product)

Catalog.hasMany(Product, {onDelete: "CASCADE", as: "Products"})
Product.belongsTo(Catalog)

Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)

User.hasMany(Order)
Order.belongsTo(User)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)