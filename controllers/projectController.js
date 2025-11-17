// controllers/projectController.js 管理作品集（Project）的CRUD，并保证与所属用户的关联
import Project from "../models/projectModel.js";

// 获取所有项目列表，这里没有分页以方便前台一次性展示
export const getProjects = async (req, res) => {
  res.json(await Project.find()); // 直接返回数组给前端
};

// 根据ID查询单个项目，同时处理不存在时的404响应
export const getProject = async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Project not found" }); // 提示作品不存在
  res.json(p);
};

// createProject 将当前用户ID写入 user 字段，实现多用户作品隔离
export const createProject = async (req, res) => {
  const project = await Project.create({ ...req.body, user: req.user._id });
  res.status(201).json(project); // 返回插入的数据，方便前端直接渲染
};

// updateProject 允许在“保护”路由下修改项目内容
export const updateProject = async (req, res) => {
  const p = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }); // new:true 返回更新后的文档
  res.json(p);
};

// deleteProject 根据ID删除指定项目，并返回统一提示
export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
