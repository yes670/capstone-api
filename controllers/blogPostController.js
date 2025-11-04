// controllers/blogPostController.js --- 最终修复版本

import BlogPost from "../models/blogPostModel.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate("author", "username").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate("author", "username")
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, summary } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required." });
    }
    const post = await BlogPost.create({ 
        title, 
        content, 
        summary: summary || '', 
        author: req.user._id 
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try { 
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }
    
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.summary = req.body.summary !== undefined ? req.body.summary : post.summary;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};