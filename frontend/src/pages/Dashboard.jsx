import { useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Dashboard = () => {
  const tasks = useLoaderData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, completed

    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;

  //logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //now add or edit the task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    setLoading(true);

    try {
      if (editTask) {
        await api.put(`/tasks/${editTask._id}`, formData);
      } else {
        await api.post("/tasks", formData);
      }
      setFormData({ title: "", description: "" });
      setShowForm(false);
      setEditTask(null);
      revalidate(); // this will refresh the loader
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //handling the edit
  const handleEdit = (task) => {
    setEditTask(task);
    setFormData({ title: task.title, description: task.description });
    setShowForm(true);
  };

  //delete the task
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      revalidate();
    } catch (err) {
      console.error(err);
    }
  };

  //toggle status
  const handleToggle = async (id) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      revalidate();
    } catch (err) {
      console.error(err);
    }
  };

//filter the task
const filteredTasks = tasks
  .filter((task) => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true; // it will return all;
  })
  .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));


//create pagination
const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
const paginatedTasks = filteredTasks.slice(
  (currentPage - 1) * tasksPerPage,
  currentPage * tasksPerPage,
);



  return (
    <div className="min-h-screen bg-gray-50">
      {/* navbar */}
      <nav>
        <h1 className="text-xl font-bold text-blue-600">Task Manager 📋</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Hi, {user?.name}! 👋</span>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>
      <p className="text-gray-500 text-sm mt-1">
        {tasks.filter((t) => t.status === "pending").length} pending •{" "}
        {tasks.filter((t) => t.status === "completed").length} completed
      </p>

      <div className="max-w-3xl mx-auto p-6">
        {/* Header + Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
            <p className="text-gray-500 text-sm mt-1">
              {tasks.length} tasks total
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditTask(null);
              setFormData({ title: "", description: "" });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Find the task..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              {editTask ? " Edit Task" : "create new task"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description (optional)"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                {loading ? "Saving..." : editTask ? "Update" : "Add"}
              </button>
            </form>
          </div>
        )}

        {/* Tasks List */}
        {paginatedTasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg">No task</p>
            <p className="text-sm mt-1">Above "+ New Task" </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedTasks.map((task) => (
              <div
                key={task._id}
                className={`bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4 transition ${
                  task.status === "completed" ? "opacity-60" : ""
                }`}
              >
                {/* Toggle Button */}
                <button
                  onClick={() => handleToggle(task._id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex-shrink-0 transition ${
                    task.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                />

                {/* Task Content */}
                <div className="flex-1">
                  <h3
                    className={`font-semibold text-gray-800 ${
                      task.status === "completed"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-500 text-sm mt-1">
                      {task.description}
                    </p>
                  )}
                  <span
                    className={`text-xs mt-2 inline-block px-2 py-1 rounded-full ${
                      task.status === "completed"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {task.status === "completed"
                      ? "✅ Completed"
                      : "⏳ Pending"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Prev
            </button>
            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
