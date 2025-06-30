import { Router } from "express";
import catalogRoutes from "./catalog.routes.js"
import userRoutes from "./user.routes.js"
import { protectRoute } from "../middleware/auth.middleware.js";
import productRoutes from "./product.routes.js"
import cartRoutes from "./cart.routes.js"
import orderRoutes from "./order.routes.js"

const router = Router()

router.use("/catalog", catalogRoutes)
router.use("/user", userRoutes)
router.use("/product", productRoutes)
router.use("/cart", protectRoute, cartRoutes)
router.use("/order", protectRoute, orderRoutes)

export default router