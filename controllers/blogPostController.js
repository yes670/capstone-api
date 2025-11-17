// controllers/blogPostController.js --- 最终修复版本
// 负责博客文章的全生命周期管理，并通过 populate 把作者与评论两个维度串联出来

import BlogPost from "../models/blogPostModel.js";

// 获取最新的文章列表，并附带作者用户名，方便前端直接渲染
export const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate("author", "username").sort({ createdAt: -1 }); // 倒序排列表明是时间线视图
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 根据文章ID获取详情，同时预加载作者信息和多级评论作者，便于一次性返回完整页面所需数据
export const getPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate("author", "username") // 加载文章作者的用户名，避免在前端再次查询
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username' // 评论作者仅公开用户名，确保敏感信息不被泄露
        }
      });

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Blog post not found' }); // 统一返回404，便于前端展示“文章不存在”提示
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 创建文章时需要校验标题/正文，同时自动关联当前登录用户为作者
export const createPost = async (req, res) => {
  try {
    const { title, content, summary } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required." }); // 参数不完整时直接返回400，避免写入空数据
    }
    const post = await BlogPost.create({ 
        title, 
        content, 
        summary: summary || '', // 摘要允许为空，便于后台自动生成或后续补充
        author: req.user._id // 从 protect 中间件注入的 user 对象获取真实作者
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新文章时需保证：1) 文章存在 2) 当前用户为文章作者，否则返回403
export const updatePost = async (req, res) => {
  try { 
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" }); // 未找到目标文章
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this post" }); // 只有原作者可以修改
    }
    
    post.title = req.body.title || post.title; // 允许部分字段更新，保持其余字段原样
    post.content = req.body.content || post.content;
    post.summary = req.body.summary !== undefined ? req.body.summary : post.summary;

    const updatedPost = await post.save();
    res.json(updatedPost); // 返回最新数据，前端可直接替换本地状态
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除文章同样验证存在性和作者身份，并在成功后返回统一提示
export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" }); // 不存在的文章无法删除
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" }); // 非作者无权删除
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" }); // 返回统一消息便于前端 toast
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};
