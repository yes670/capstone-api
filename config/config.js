// config/config.js 作为旧版连接封装示例，提供可复用的 MongoDB Atlas 连接逻辑
import mongoose from 'mongoose';

// connectDB 函数在应用启动时被调用，负责建立数据库连接并在失败时终止进程
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }); // 使用官方推荐的解析与拓扑设置，避免弃用警告
    console.log('✅ MongoDB Connected'); // 成功连接时输出勾选标识，方便观察日志
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message); // 将错误堆栈打印出来
    process.exit(1); // 连接失败继续运行可能导致接口报错，因此立即退出
  }
};

export default connectDB; // 供 server.js 等入口文件直接导入使用
