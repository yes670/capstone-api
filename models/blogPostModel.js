import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);


blogPostSchema.virtual('comments', {
  ref: 'Comment',       // 要引用的模型是 'Comment'
  localField: '_id',    // 关联的本地字段是 BlogPost 的 _id
  foreignField: 'post', // 关联的外部字段是 Comment 模型中的 'post' 字段
  justOne: false        // 我们需要一个评论数组，而不是单个评论
});

blogPostSchema.set('toJSON', { virtuals: true });
blogPostSchema.set('toObject', { virtuals: true });


export default mongoose.model("BlogPost", blogPostSchema);
