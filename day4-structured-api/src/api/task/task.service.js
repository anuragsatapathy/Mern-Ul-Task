// In-memory todo storage and business logic
let tasks = [];

const getAllTasks = (query = {}) => {
  let result = tasks.slice();

  if (query.completed !== undefined) {
    const completed = query.completed === "true" || query.completed === true;
    result = result.filter(t => t.completed === completed);
  }

  if (query.search) {
    const q = String(query.search).toLowerCase();
    result = result.filter(
      t => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)
    );
  }

  return result;
};

const getTaskById = (id) => tasks.find(t => String(t.id) === String(id));

const createTask = ({ title, description }) => {
  const newTask = {
    id: Date.now().toString(),
    title: title || "Untitled task",
    description: description || "",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(newTask);
  return newTask;
};

const updateTask = (id, updatedData) => {
  const task = getTaskById(id);
  if (!task) return null;

  if (updatedData.title !== undefined) task.title = updatedData.title;
  if (updatedData.description !== undefined) task.description = updatedData.description;
  if (updatedData.completed !== undefined) task.completed = Boolean(updatedData.completed);

  task.updatedAt = new Date().toISOString();
  return task;
};

const deleteTask = (id) => {
  const idx = tasks.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return null;
  const removed = tasks.splice(idx, 1);
  return removed[0];
};

const markComplete = (id) => updateTask(id, { completed: true });

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markComplete
};
