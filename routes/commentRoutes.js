// routes/commentRoutes.js --- 最终正确版本
// 该路由模块只负责在文章详情下创建评论，路径继承自父博客路由

import express from 'express';
import { createComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

// `mergeParams: true` 是关键！它允许这个路由访问父路由 (:id) 的参数
const router = express.Router({ mergeParams: true });

// 定义创建评论的路由
// POST /api/blog/:id/comments
router.route('/').post(protect, createComment); // protect 确保只有登录用户才能发表评论

export default router;
