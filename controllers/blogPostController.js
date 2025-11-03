import BlogPost from "../models/blogPostModel.js";

export const getAllPosts = async (req, res) => {
  const posts = await BlogPost.find().populate("author", "username");
  res.json(posts);
};

export const getPost = async (req, res) => {
  const post = await BlogPost.findById(req.params.id)
    .populate("author", "username") // 填充文章作者，只选择 username
    .populate({
      path: 'comments', // 填充 comments 虚拟字段
      populate: {
        path: 'author', // 对每个 comment，再填充其 author 字段
        select: 'username' // 对于评论的作者，也只选择 username
      }
    });

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Blog post not found' });
  }
};

export const createPost = async (req, res) => {
  const post = await BlogPost.create({ ...req.body, author: req.user._id });
  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const p = await BlogPost.findById(req.params.id);
  if (p.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });

  p.title = req.body.title || p.title;
  p.content = req.body.content || p.content;
  await p.save();
  res.json(p);
};

export const deletePost = async (req, res) => {
  const p = await BlogPost.findById(req.params.id);
  if (p.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });

  await p.deleteOne();
  res.json({ message: "Post deleted" });
};
