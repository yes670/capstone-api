// routes/messageRoutes.js 仅处理 /api/contact 的表单提交
import express from "express";
import { submitMessage } from "../controllers/messageController.js";

const router = express.Router();
router.post("/", submitMessage); // POST /api/contact -> 存储一条新的 Message

export default router;
