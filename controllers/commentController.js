// controllers/commentController.js --- 最终修复版本
// 专注处理评论创建逻辑，并同步维护评论与文章、用户之间的关联关系

import Comment from '../models/commentModel.js';
import BlogPost from '../models/blogPostModel.js'; // <--- 添加这一行导入！
// BlogPost 模型帮助我们验证评论目标文章是否存在，并在成功后把评论ID附加到文章上

// createComment 完成三件事：校验输入、写入 Comment 集合、同步文章的 comments 列表
export const createComment = async (req, res) => {
  try {
    const { content } = req.body; 
    const authorId = req.user._id; // protect 中间件已经将当前登录用户注入到 req.user
    const postId = req.params.id; // 嵌套路由 /api/blog/:id/comments 提供文章ID

    if (!content) {
      return res.status(400).json({ message: "Comment content cannot be empty." }); // 保证评论正文不能为空
    }

    const postExists = await BlogPost.findById(postId); // 先确认文章存在再写评论，避免孤儿评论
    if (!postExists) {
        return res.status(404).json({ message: "Blog post not found." }); // 对不存在的文章返回404
    }

    const newComment = new Comment({
      body: content,
      author: authorId,
      post: postId,
    });

    await newComment.save(); // 写入 Comment 集合
    
    // 假设你的 BlogPost 模型有 comments 数组
    if (postExists.comments) {
      postExists.comments.push(newComment._id); // 将新评论的ID记录到文章的虚拟字段
      await postExists.save(); // 同步保存，确保数据一致性
    }
    
    const populatedComment = await Comment.findById(newComment._id).populate('author', 'username'); // 返回时带上评论作者用户名
    
    res.status(201).json(populatedComment);

  } catch (error) {
    console.error("Error creating comment:", error); // 记录错误方便排查
    res.status(500).json({ message: "Server error while creating comment." }); // 统一的错误响应
  }
};
