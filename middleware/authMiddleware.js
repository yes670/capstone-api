// middleware/authMiddleware.js 用于保护需要认证的路由，通过校验 JWT 并把用户信息挂到 req 上
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // 约定前端以 `Bearer <token>` 提供凭证
  if (!token) return res.status(401).json({ message: "No token, unauthorized" }); // 未提供令牌直接拒绝访问

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 验证签名并解析出 userId
    req.user = await User.findById(decoded.userId).select("-password"); // 将无密码的用户对象注入下游
    next(); // 授权成功，进入下一个中间件或控制器
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" }); // 校验失败统一返回401
  }
};

export { protect };
