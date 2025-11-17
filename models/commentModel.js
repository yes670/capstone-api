// models/commentModel.js 描述评论内容以及与作者、文章之间的引用关系
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    body: { type: String, required: true }, // 评论正文
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 指向发布评论的用户
    post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost", required: true } // 指向所属文章
  },
  { timestamps: true } // 记录评论的创建和更新时间
);

export default mongoose.model("Comment", commentSchema); // 供评论控制器使用
