const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const WorkspaceSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: String,
    priority: String,
    dueDate: Date,
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model("User", UserSchema),
  Workspace: mongoose.model("Workspace", WorkspaceSchema),
  Project: mongoose.model("Project", ProjectSchema),
  Task: mongoose.model("Task", TaskSchema),
};
