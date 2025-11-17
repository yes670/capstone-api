// models/userModel.js 定义系统账号的基本属性以及密码加密逻辑
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // 用户名唯一
  email: { type: String, required: true, unique: true }, // 邮箱用作登录凭据
  password: { type: String, required: true, minlength: 6 } // 密码在入库前将被hash
});

// hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // 仅在密码被修改时重新加密
  this.password = await bcrypt.hash(this.password, 10); // 使用10轮 salt 的 bcrypt 加密
});

export default mongoose.model("User", userSchema); // 导出供认证控制器使用
