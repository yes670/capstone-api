// controllers/messageController.js 处理「联系我们」表单的入库逻辑
import Message from "../models/messageModel.js";

// submitMessage 没有复杂业务，仅负责把前端提交的 name/email/message 写入数据库
export const submitMessage = async (req, res) => {
  const m = await Message.create(req.body); // 直接使用请求体创建消息记录
  res.status(201).json(m); // 返回201以及刚插入的记录，便于前端展示提交成功信息
};
