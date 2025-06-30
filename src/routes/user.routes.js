import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/signup", userController.signup)
router.post("/signin", userController.signin)
router.get("/role", protectRoute, userController.getRole)

export default router