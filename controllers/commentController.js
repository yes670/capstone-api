// 后端 controllers/commentController.js --- 添加了详细日志的版本

export const createComment = async (req, res) => {
  console.log("--- 1. Received request to create comment ---");
  try {
    // 打印出所有能拿到的信息
    console.log("Request Body (req.body):", req.body);
    console.log("Request User (req.user):", req.user);
    console.log("Request Params (req.params):", req.params);

    const { content } = req.body;
    const authorId = req.user._id;
    const postId = req.params.id;

    console.log(`--- 2. Parsed data: content='${content}', authorId='${authorId}', postId='${postId}' ---`);

    if (!content || !authorId || !postId) {
      console.log("--- ERROR: Missing required data ---");
      return res.status(400).json({ message: "Content, author, and post ID are required." });
    }

    const postExists = await BlogPost.findById(postId);
    if (!postExists) {
        console.log(`--- ERROR: Blog post with ID ${postId} not found ---`);
        return res.status(404).json({ message: "Blog post not found." });
    }
    console.log("--- 3. Found the blog post successfully ---");

    const newComment = new Comment({
      body: content,
      author: authorId,
      post: postId,
    });
    console.log("--- 4. Created new Comment instance:", newComment);

    await newComment.save();
    console.log("--- 5. Saved the new comment successfully ---");

    postExists.comments.push(newComment._id);
    await postExists.save();
    console.log("--- 6. Pushed comment to post's comments array and saved post ---");

    const populatedComment = await Comment.findById(newComment._id).populate('author', 'username');
    console.log("--- 7. Populated the new comment successfully ---");

    res.status(201).json(populatedComment);

  } catch (error) {
    console.error("--- FINAL CRASH in createComment ---:", error); // 打印出导致500的最终错误
    res.status(500).json({ message: "Server error while creating comment." });
  }
};