// routes/userRoutes.js 暴露注册与登录两个公开接口
import express from "express";
import { register, login } from "../controllers/userController.js";
const router = express.Router();

router.post("/register", register); // POST /api/users/register
router.post("/login", login); // POST /api/users/login

export default router;
