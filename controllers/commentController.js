// controllers/commentController.js

import Comment from "../models/commentModel.js";

export const getComments = async (req, res) => {
  // ------------------- 修改这里 -------------------
  // 将 req.params.postId 改为 req.params.id
  const c = await Comment.find({ post: req.params.id }).populate("author", "username");
  // ------------------------------------------------
  res.json(c);
};

export const createComment = async (req, res) => {
  const c = await Comment.create({
    body: req.body.body,
    // ------------------- 修改这里 -------------------
    // 将 req.params.postId 改为 req.params.id
    post: req.params.id,
    // ------------------------------------------------
    author: req.user._id
  });
  res.status(201).json(c);
};