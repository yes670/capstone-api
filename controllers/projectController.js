import Project from "../models/projectModel.js";

export const getProjects = async (req, res) => {
  res.json(await Project.find());
};

export const getProject = async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Project not found" });
  res.json(p);
};

export const createProject = async (req, res) => {
  const project = await Project.create({ ...req.body, user: req.user._id });
  res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const p = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
