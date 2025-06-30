import sequelize from "../lib/db.js"
import { DataTypes } from "sequelize"

const Cart = sequelize.define("cart", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

export default Cart