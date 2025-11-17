// models/projectModel.js 表述作品集条目的基本字段
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true }, // 作品标题
  description: { type: String, required: true }, // 简要描述
  imageUrl: String, // 展示封面图
  repoUrl: String, // 源码仓库地址
  liveUrl: String, // 部署链接
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // 关联到创建该项目的用户
});

export default mongoose.model("Project", projectSchema); // 导出供项目控制器调用
