import BlogPost from "../models/blogPostModel.js";

export const getAllPosts = async (req, res) => {
  const posts = await BlogPost.find().populate("author", "username");
  res.json(posts);
};



export const getPost = async (req, res) => {
  try { // 加上 try...catch 是一个好习惯
    const post = await BlogPost.findById(req.params.id)
      .populate("author", "username"); // 只 populate 作者

    
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    console.error("Error fetching single post:", error);
    res.status(500).json({ message: "Server error while fetching post." });
  }


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
