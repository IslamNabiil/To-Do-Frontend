// src/App.jsx
import { useState, useEffect } from "react";
import api from "./api/axios";
import "./App.css";
import { FaTrashAlt, FaEdit, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        // التعديل
        const res = await api.patch(`/tasks/${editingTaskId}`, formData);
        setTasks(
          tasks.map((task) =>
            task._id === editingTaskId ? res.data.updatedTask : task
          )
        );
        toast.success("Task updated successfully!");
        setEditingTaskId(null);
      } else {
        // الإضافة
        const res = await api.post("/tasks", formData);
        setTasks([...tasks, res.data]);
        toast.success(`${formData.title} added successfully!`, {
          duration: 2000,
        });
      }
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const newStatus = !task.isCompleted;

      // تحديث الباك اند
      await api.patch(`/tasks/${task._id}`, {
        isCompleted: newStatus,
      });

      // تحديث الفرونت اند
      setTasks(
        tasks.map((t) =>
          t._id === task._id ? { ...t, isCompleted: newStatus } : t
        )
      );

      if (newStatus) {
        toast.success("Great job! Task completed 👏");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Could not update task");
    }
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task._id === taskId);
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
      });
      setEditingTaskId(taskId);
      // Scroll to form (اختياري: يطلع لفوق عند الفورم)
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    // ✅ التعديل: حفظ الاسم قبل الحذف عشان الرسالة تظهر صح
    const taskTitle = tasks.find((t) => t._id === taskId)?.title;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));

      toast.success(`${taskTitle} deleted successfully!`, {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      <h1>To-Do List Project 🚀</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter your Title here"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          id="description"
          placeholder="Enter your description here"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        <button type="submit">
          {editingTaskId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div className="tasks-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              /* Skeleton Loading */
              <>
                {[1, 2, 3, 4, 5].map((n) => (
                  <tr key={n} className="task-row loading">
                    <td colSpan="4"></td>
                  </tr>
                ))}
              </>
            ) : tasks.length > 0 ? (
              tasks.map((task, n) => (
                <tr key={task._id} className="task-row">
                  <td>{n + 1}</td>

                  {/* ✅ التعديل: إضافة الشطب على الكلام لو المهمة خلصت */}
                  <td
                    style={{
                      textDecoration: task.isCompleted
                        ? "line-through"
                        : "none",
                      color: task.isCompleted ? "#999" : "inherit",
                    }}
                  >
                    {task.title}
                  </td>

                  <td
                    style={{
                      textDecoration: task.isCompleted
                        ? "line-through"
                        : "none",
                      color: task.isCompleted ? "#999" : "inherit",
                    }}
                  >
                    {task.description}
                  </td>

                  <td className="actions-cell">
                    <button
                      className="btn-done"
                      title="Complete"
                      onClick={() => handleToggleComplete(task)}
                      style={{ color: task.isCompleted ? "green" : "#ccc" }}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="btn-edit"
                      title="Edit"
                      onClick={() => handleEdit(task._id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-delete"
                      title="Delete"
                      onClick={() => handleDelete(task._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No tasks found. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
