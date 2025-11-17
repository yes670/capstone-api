// routes/projectRoutes.js 与项目 CRUD 控制器配合使用，确保敏感操作需要认证
import express from "express";
import { getProjects, getProject, createProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js"; // 保护创建/更新/删除接口
const router = express.Router();

router.get("/", getProjects); // 获取所有项目列表
router.get("/:id", getProject); // 获取指定项目详情
router.post("/", protect, createProject); // 创建项目，需要携带JWT
router.put("/:id", protect, updateProject); // 更新项目，同样需要认证
router.delete("/:id", protect, deleteProject); // 删除项目，认证后执行

export default router;
