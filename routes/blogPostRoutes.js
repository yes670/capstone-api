// routes/blogPostRoutes.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

// 导入控制器函数，确保名称与控制器文件中的导出名称完全一致
import { 
    getAllPosts, 
    getPost, 
    createPost, 
    updatePost, 
    deletePost 
} from '../controllers/blogPostController.js';

// 导入评论路由
import commentRoutes from './commentRoutes.js';

const router = express.Router();

// 将嵌套的评论路由请求转发给 commentRoutes 处理
// 注意：参数名已统一为 :id
router.use('/:id/comments', commentRoutes);

// 定义博客文章的主要路由
// 使用从控制器导入的正确函数名
router.route('/')
    .get(getAllPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(getPost)
    .put(protect, updatePost)
    .delete(protect, deletePost);

export default router;