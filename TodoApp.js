import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/tasks";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState("all");

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD / EDIT
  const addTask = async () => {
    if (!text) return;

    let finalPriority = priority;

    if (
      text.toLowerCase().includes("exam") ||
      text.toLowerCase().includes("urgent")
    ) {
      finalPriority = "High";
    }

    if (editId) {
      await axios.put(`${API}/edit/${editId}`, {
        text,
        priority: finalPriority,
        dueDate
      });
      setEditId(null);
    } else {
      await axios.post(API, {
        text,
        priority: finalPriority,
        dueDate
      });
    }

    setText("");
    setDueDate("");
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await axios.put(`${API}/${id}`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setText(task.text);
    setPriority(task.priority);
    setDueDate(task.dueDate?.slice(0, 10));
    setEditId(task._id);
  };

  const highlightText = (text, search) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} style={{ background: "#fde047" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filtered = tasks
    .filter(t => {
      if (tab === "pending") return !t.completed;
      if (tab === "completed") return t.completed;
      return true;
    })
    .filter(t =>
      t.text.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="app">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Taskora</h2>

        <button onClick={() => setTab("all")}>All Tasks</button>
        <button onClick={() => setTab("pending")}>Pending</button>
        <button onClick={() => setTab("completed")}>Completed</button>
      </div>

      {/* Main */}
      <div className="main">

        <h1>Task Dashboard</h1>

        <input
          className="search"
          placeholder="Search tasks..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Input */}
        <div className="inputBox">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter task..."
          />

          <select onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>

          <input type="date" onChange={(e) => setDueDate(e.target.value)} />

          <button onClick={addTask}>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* Tasks */}
        {filtered.map(task => (
          <div className="taskCard" key={task._id}>

            <div className="left">

              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id)}
              />

              <span className={task.completed ? "done" : ""}>
                {highlightText(task.text, search)}
              </span>

              <span className={`badge ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>

              <small>{task.dueDate?.slice(0,10)}</small>

              {task.completed && task.completedAt && (
                <small style={{ marginLeft: "10px", color: "gray" }}>
                  Done: {new Date(task.completedAt).toLocaleString()}
                </small>
              )}

            </div>

            <div>
              <button onClick={() => startEdit(task)}>✏️</button>
              <button onClick={() => deleteTask(task._id)}>🗑</button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}