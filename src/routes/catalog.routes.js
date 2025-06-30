import { Router } from "express";
import catalogController from "../controllers/catalog.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/", protectRoute, catalogController.createCatalog)
router.get("/", catalogController.getAllCatalog)
router.get("/:id", catalogController.getOneCatalog)
router.get("/products/:id", catalogController.getProdutcByCatalog)
router.put("/:id", protectRoute, catalogController.updateCatalog)
router.delete("/:id", protectRoute, catalogController.deleteCatalog)

export default router