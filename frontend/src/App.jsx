import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toast, setToast] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (error) {
      setToast("Unable to load tasks right now.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addTask = async (taskData) => {
    try {
      await axios.post(API, taskData);
      setToast("Task added successfully.");
      await fetchTasks();
    } catch (error) {
      setToast("Could not add task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setToast("Task removed.");
      await fetchTasks();
    } catch (error) {
      setToast("Could not delete task.");
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await axios.put(`${API}/${id}`, taskData);
      setEditingTask(null);
      setToast("Task updated.");
      await fetchTasks();
    } catch (error) {
      setToast("Could not update task.");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = `${task.title} ${task.description || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, filterStatus]);

  return (
    <div className="container py-6 sm:py-8">
      <div className="glass-panel rounded-[28px] p-5 sm:p-8 shadow-2xl">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Productivity Studio</p>
              <h1 className="mt-2 text-4xl font-semibold text-white sm:text-5xl">Task Tracker</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                A refined dashboard for capturing ideas, tracking progress, and presenting a polished workflow.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200">
              <div className="font-medium">{tasks.length} active tasks</div>
              <div className="text-slate-400">{tasks.filter((task) => task.status === "Completed").length} completed</div>
            </div>
          </header>

          <TaskForm
            addTask={addTask}
            editingTask={editingTask}
            updateTask={updateTask}
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks"
              className="input-field w-full rounded-xl px-4 py-3 sm:max-w-xs"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field rounded-xl px-4 py-3 sm:min-w-[180px]"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <TaskList
            tasks={filteredTasks}
            deleteTask={deleteTask}
            setEditingTask={setEditingTask}
          />
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-5 right-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100 shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

export default App;