// server.js 是整个Express应用的入口文件，负责初始化中间件、数据库连接以及所有业务路由
import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// 业务路由模块按照「用户/项目/博客/评论/消息」划分，便于讲解职责边界
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogPostRoutes from "./routes/blogPostRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
// 初始化数据库连接，确保所有路由处理程序在执行前已具备数据访问能力
connectDB();

const app = express();
// 在应用级别依次挂载解析、加固、跨域等基础中间件
app.use(express.json()); // 解析前端提交的JSON请求体，避免手动解析
app.use(helmet()); // 设置常见安全响应头，减轻XSS、Clickjacking等风险
app.use(cors()); // 允许浏览器跨域访问，便于本地调试或多域部署

// Routes
// 明确说明每个子路由负责的领域，老师提问时可以逐项说明
app.use("/api/users", userRoutes); // 注册/登录等鉴权接口
app.use("/api/projects", projectRoutes); // 作品集管理（增删改查）
app.use("/api/blog", blogPostRoutes); // 博客文章及其嵌套路由
app.use("/api/comments", commentRoutes); // 可独立接入评论服务
app.use("/api/contact", messageRoutes); // 联系表单消息入库

// Global Error Handler
// 兜底捕获下游抛出的错误信息，保证服务即使出现异常也能返回一致的JSON响应
app.use((err, req, res, next) => {
  console.log(err); // 将完整错误输出到控制台，方便复盘问题
  res.status(500).json({ message: "Server error", error: err.message }); // 永远返回统一结构，便于前端提示
});

// 支持通过环境变量动态调整端口，默认5000以满足本地开发
const PORT = process.env.PORT || 5000;
// 监听端口时输出提示信息，方便验证部署环境是否工作正常
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
