// models/blogPostModel.js 定义博客文章结构，包括标题、正文、摘要及作者关联
import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // 标题为必填项
    content: { type: String, required: true }, // 正文内容必填
    summary: { type: String }, // 摘要可选，用于列表页简要展示
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // 关联作者
  },
  { timestamps: true } // 自动维护 createdAt/updatedAt，方便排序
);

// 利用Mongoose虚拟字段把 Comment 集合中的 post 外键映射为文章的 comments 数组
blogPostSchema.virtual('comments', {
  ref: 'Comment',       // 要引用的模型是 'Comment'
  localField: '_id',    // 关联的本地字段是 BlogPost 的 _id
  foreignField: 'post', // 关联的外部字段是 Comment 模型中的 'post' 字段
  justOne: false        // 我们需要一个评论数组，而不是单个评论
});

blogPostSchema.set('toJSON', { virtuals: true }); // 默认在JSON输出中包含虚拟字段，方便API返回
blogPostSchema.set('toObject', { virtuals: true }); // 同样适用于toObject，用于服务端内部处理


export default mongoose.model("BlogPost", blogPostSchema); // 默认导出，控制器中直接引入
