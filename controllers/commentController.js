// controllers/commentController.js --- 最终修复版本

import Comment from '../models/commentModel.js';
import BlogPost from '../models/blogPostModel.js'; // <--- 添加这一行导入！

export const createComment = async (req, res) => {
  try {
    const { content } = req.body; 
    const authorId = req.user._id;
    const postId = req.params.id;

    if (!content) {
      return res.status(400).json({ message: "Comment content cannot be empty." });
    }

    const postExists = await BlogPost.findById(postId); // 现在 BlogPost 已被定义
    if (!postExists) {
        return res.status(404).json({ message: "Blog post not found." });
    }

    const newComment = new Comment({
      body: content,
      author: authorId,
      post: postId,
    });

    await newComment.save();
    
    // 假设你的 BlogPost 模型有 comments 数组
    if (postExists.comments) {
      postExists.comments.push(newComment._id);
      await postExists.save();
    }
    
    const populatedComment = await Comment.findById(newComment._id).populate('author', 'username');
    
    res.status(201).json(populatedComment);

  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error while creating comment." });
  }
};
