// src/App.jsx
import { useState, useEffect } from "react";
import api from "./api/axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
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

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter your Title here"
          value={formData.title}
          onChange={handleChange}
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
      {tasks.length > 0 ? (
        <div className="tasks-container">
          {tasks.map((task) => (
            <div key={task._id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p> Loading ... </p>
      )}
    </div>
  );
}

export default App;
