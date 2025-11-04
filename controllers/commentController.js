// controllers/commentController.js --- 最终正确版本

import Comment from '../models/commentModel.js';
import BlogPost from '../models/blogPostModel.js';

// @desc    Create a new comment for a blog post
// @route   POST /api/blog/:id/comments
// @access  Private
export const createComment = async (req, res) => {
  try {
    // 1. 从前端请求中获取数据
    // 前端发送的是 { content: '...' }
    const { content } = req.body; 
    const authorId = req.user._id; // 从 protect 中间件获取作者ID
    const postId = req.params.id; // 从 URL 参数获取文章ID

    // 2. 检查评论内容是否为空
    if (!content) {
      return res.status(400).json({ message: "Comment content cannot be empty." });
    }

    // 3. 检查博客文章是否存在
    const postExists = await BlogPost.findById(postId);
    if (!postExists) {
        return res.status(404).json({ message: "Blog post not found." });
    }

    // 4. 创建新的 Comment 实例，提供所有必填字段
    const newComment = new Comment({
      body: content,   // 将前端的 'content' 映射到模型的 'body'
      author: authorId,
      post: postId,
    });

    // 5. 保存新的评论到数据库
    await newComment.save();
    
    // 6. (可选但推荐) 将新评论的ID添加到 BlogPost 的 comments 数组中
    //    如果你的 BlogPost 模型有 comments 数组的话
    postExists.comments.push(newComment._id);
    await postExists.save();
    
    // 7. 填充作者信息后返回新创建的评论，以便前端可以直接显示
    const populatedComment = await Comment.findById(newComment._id).populate('author', 'username');
    
    res.status(201).json(populatedComment);

  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error while creating comment." });
  }
};