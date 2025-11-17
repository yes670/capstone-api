// controllers/userController.js 负责用户注册与登录逻辑，最终都会返回JWT供前端存储
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 注册流程：检查邮箱重复 -> 创建用户 -> 签发 JWT
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" }); // 保证邮箱唯一

    const user = await User.create({ username, email, password }); // userModel 里会触发密码哈希
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); // 签发JWT，用于前后端会话保持

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 登录流程：验证账号存在 -> 对比密码 -> 签发新的 JWT
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" }); // 避免泄露注册信息，统一提示

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" }); // 使用 bcrypt.compare 校验加密后的密码

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token }); // 返回 token，前端可存于 localStorage/HTTP-only cookie
};
