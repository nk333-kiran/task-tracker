function TaskList({ tasks, deleteTask, setEditingTask }) {
  const getStatusClass = (status) => {
    if (status === "Completed") return "status-completed";
    if (status === "In Progress") return "status-progress";
    return "status-pending";
  };

  if (!tasks.length) {
    return (
      <div className="fade-in rounded-3xl border border-dashed border-white/15 bg-slate-900/40 p-8 text-center text-slate-300">
        No tasks match this view yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {tasks.map((task) => (
        <div key={task._id || task.id} className="fade-in rounded-3xl border border-white/10 bg-slate-900/55 p-5 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">{task.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{task.description || "No description provided."}</p>
            </div>
            <span className={`status-pill ${getStatusClass(task.status)}`}>{task.status}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setEditingTask(task)}
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 transition hover:bg-white/20"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTask(task._id || task.id)}
              className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;