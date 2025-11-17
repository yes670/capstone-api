// models/messageModel.js 用于保存“联系我”表单提交的内容
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 提交者姓名
    email: { type: String, required: true }, // 方便后续回复
    message: { type: String, required: true } // 留言主体
  },
  { timestamps: true } // 记录提交时间，用于后台排序
);

export default mongoose.model("Message", messageSchema); // 供 messageController 使用
