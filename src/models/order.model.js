import sequelize from "../lib/db.js"
import { DataTypes } from "sequelize"

const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    adres: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    totalPrice: { type: DataTypes.INTEGER, allowNull: false },
    totalDiscount: { type: DataTypes.INTEGER, defaultValue: 0 },
})

export default Order