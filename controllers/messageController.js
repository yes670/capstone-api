import Message from "../models/messageModel.js";

export const submitMessage = async (req, res) => {
  const m = await Message.create(req.body);
  res.status(201).json(m);
};
