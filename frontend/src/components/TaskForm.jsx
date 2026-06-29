import { useEffect, useState } from "react";

function TaskForm({ addTask, editingTask, updateTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      setStatus(editingTask.status);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      window.alert("Title is required");
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status
    };

    if (editingTask) {
      updateTask(editingTask._id, taskData);
    } else {
      addTask(taskData);
    }

    setTitle("");
    setDescription("");
    setStatus("Pending");
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in rounded-3xl border border-white/10 bg-slate-900/50 p-4 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field w-full rounded-xl px-4 py-3"
          />
          <textarea
            placeholder="Add a short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-30 w-full rounded-xl px-4 py-3"
          />
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field w-full rounded-xl px-4 py-3"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          >
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default TaskForm;