// src/App.jsx
import { useState, useEffect } from "react";
import api from "./api/axios";
import "./App.css";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
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
        // التعديل الصح
        const res = await api.patch(`/tasks/${editingTaskId}`, formData);
        setTasks(
          tasks.map((task) =>
            task._id === editingTaskId ? res.data.updatedTask : task
          ) // 👈 ركز هنا
        );
        toast.success("Task updated successfully!");
        setEditingTaskId(null);
      } else {
        const res = await api.post("/tasks", formData);
        setTasks([...tasks, res.data]);
        toast.success(formData.title + " added successfully!", {
          duration: 2000,
        });
      }
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = async (taskId) => {
    try {
      const taskToEdit = await tasks.find((task) => task._id === taskId);
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
      });
      setEditingTaskId(taskId);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success(
        tasks.find((t) => t._id === taskId)?.title + " deleted successfully!",
        {
          duration: 2000,
        }
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Fetch tasks when the component mounts
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
              <>
                <tr className="task-row loading">
                  <td colSpan="4" style={{ textAlign: "center" }}></td>
                </tr>
                <tr className="task-row loading">
                  <td colSpan="4" style={{ textAlign: "center" }}></td>
                </tr>
                <tr className="task-row loading">
                  <td colSpan="4" style={{ textAlign: "center" }}></td>
                </tr>
                <tr className="task-row loading">
                  <td colSpan="4" style={{ textAlign: "center" }}></td>
                </tr>
                <tr className="task-row loading">
                  <td colSpan="4" style={{ textAlign: "center" }}></td>
                </tr>
              </>
            ) : tasks.length > 0 ? (
              tasks.map((task, n) => (
                <tr key={task._id} className="task-row">
                  <td>{n + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td className="actions-cell">
                    <button className="btn-done" title="Complete">
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
                <td colSpan="4" style={{ textAlign: "center" }}>
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
