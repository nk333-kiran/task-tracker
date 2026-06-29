const fs = require("fs");
const path = require("path");
const Task = require("../models/Task");
const { isDbAvailable } = require("../config/db");

const DATA_FILE = path.join(__dirname, "..", "data", "tasks.json");

const ensureDataStore = () => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
};

const loadTasks = () => {
  ensureDataStore();
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
};

const saveTasks = (tasks) => {
  ensureDataStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
};

const normalizeTask = (task, id) => ({
  ...task,
  _id: task._id || id,
  id: task.id || String(id)
});

const getPersistentTasks = () => {
  return loadTasks().map((task, index) => normalizeTask(task, task._id || task.id || String(index + 1)));
};

const writePersistentTask = (task) => {
  const tasks = getPersistentTasks();
  const nextTasks = [task, ...tasks.filter((item) => item._id !== task._id && item.id !== task.id)];
  saveTasks(nextTasks);
  return task;
};

// CREATE
const createTask = async (req, res) => {
  if (!isDbAvailable()) {
    const tasks = getPersistentTasks();
    const task = normalizeTask(
      {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      String(tasks.length + 1)
    );
    writePersistentTask(task);
    return res.status(201).json(task);
  }

  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
const getTasks = async (req, res) => {
  if (!isDbAvailable()) {
    const tasks = getPersistentTasks().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(tasks);
  }

  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE
const getTask = async (req, res) => {
  if (!isDbAvailable()) {
    const task = getPersistentTasks().find((item) => item._id === req.params.id || item.id === req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.json(task);
  }

  try {
    const task = await Task.findById(req.params.id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateTask = async (req, res) => {
  if (!isDbAvailable()) {
    const tasks = getPersistentTasks();
    const taskIndex = tasks.findIndex((task) => task._id === req.params.id || task.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = normalizeTask(
      {
        ...tasks[taskIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      },
      req.params.id
    );
    tasks[taskIndex] = updatedTask;
    saveTasks(tasks);
    return res.json(updatedTask);
  }

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteTask = async (req, res) => {
  if (!isDbAvailable()) {
    const tasks = getPersistentTasks().filter((task) => task._id !== req.params.id && task.id !== req.params.id);
    saveTasks(tasks);
    return res.json({ message: "Task deleted" });
  }

  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
};