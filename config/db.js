// config/db.js 是当前项目实际使用的数据库连接模块
import mongoose from "mongoose";

// connectDB 在 server.js 中被调用，一旦失败就中止服务以避免接口继续报错
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // 利用环境变量存储连接字符串，避免硬编码
    console.log("✅ MongoDB Atlas Connected"); // 成功后打印日志，便于观察部署状态
  } catch (err) {
    console.log("❌ MongoDB Error:", err.message); // 控制台输出具体错误信息
    process.exit(1); // 终止进程，提示开发者尽快修复数据库连接配置
  }
};

export default connectDB; // 默认导出供入口使用
