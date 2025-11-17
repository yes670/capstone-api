// routes/blogPostRoutes.js
// 定义博客文章与其嵌套评论的路由映射，集中管理权限控制与路径结构

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
router.use('/:id/comments', commentRoutes); // 在访问具体文章的评论时复用 commentRoutes

// 定义博客文章的主要路由
// 使用从控制器导入的正确函数名
router.route('/')
    .get(getAllPosts) // 获取所有文章列表，无需登录
    .post(protect, createPost); // 创建文章需登录，protect 会写入 req.user

router.route('/:id')
    .get(getPost) // 访问特定文章详情
    .put(protect, updatePost) // 更新文章需作者身份
    .delete(protect, deletePost); // 删除文章同样需要认证

export default router;
