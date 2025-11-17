// Centralized Error Handler
// 全局错误集中处理器：统一处理所有通过 next(err) 传入的错误，保证响应结构一致
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err); // 将错误内容输出到服务器控制台，方便排查

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // 若未显式设置状态码，则默认500

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error", // 保持 message 字段语义一致
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // 开发环境提供堆栈信息
  });
};

export default errorHandler; // 导出以便在 server.js 中全局挂载
