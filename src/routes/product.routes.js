import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/", protectRoute, productController.createPrduct)
router.get("/popular", productController.getProductPopular)
router.get("/new", productController.getProductNew)
router.put("/:id", protectRoute, productController.updateProduct)
router.delete("/:id", protectRoute, productController.deleteProduct)

export default router