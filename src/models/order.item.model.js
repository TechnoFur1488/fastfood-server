import sequelize from "../lib/db.js";
import { DataTypes } from "sequelize";

const OrderItem = sequelize.define("order-item", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    discount: {type: DataTypes.INTEGER, defaultValue: 0},
})

export default OrderItem