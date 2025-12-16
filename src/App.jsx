// src/App.jsx
import { useState, useEffect } from "react";
import api from "./api/axios";
import "./App.css";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);

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
      const res = await api.post("/tasks", formData);
      setTasks([...tasks, res.data]);
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding task:", error);
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
        <button type="submit">Add Task</button>
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
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>Loading ...</td>
                </tr>
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
                    <button className="btn-edit" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="btn-delete" title="Delete">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>No tasks found. Add one above!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}

export default App;
