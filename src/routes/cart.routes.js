import {Router} from "express"
import cartController from "../controllers/cart.controller.js"

const router = Router()

router.post("/:productId", cartController.addCart)
router.get("/", cartController.getCart)
router.put("/:id", cartController.updateCart)
router.delete("/:id", cartController.deleteCart)

export default router