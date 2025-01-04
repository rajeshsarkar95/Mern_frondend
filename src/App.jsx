import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get(API_URL);
    setTasks(response.data);
  };

  const addTask = async () => {
    if (task.trim()) {
      const response = await axios.post(API_URL, { text: task });
      setTasks([...tasks, response.data]);
      setTask("");
    }
  };

  const toggleTask = async (id, completed) => {
    const response = await axios.put(`${API_URL}/${id}`, {
      completed: !completed,
    });
    setTasks(tasks.map((t) => (t._id === id ? response.data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const startEditTask = (id, text) => {
    setEditTaskId(id);
    setEditTaskText(text);
  };

  const saveEditTask = async () => {
    if (editTaskText.trim()) {
      const response = await axios.put(`${API_URL}/${editTaskId}`, {
        text: editTaskText,
      });
      setTasks(tasks.map((t) => (t._id === editTaskId ? response.data : t)));
      setEditTaskId(null);
      setEditTaskText("");
    }
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTaskText("");
  };

  return (
    <main>
      <div className="App">
        <header className="App-header">
          <h1>Todo List</h1>
          <div>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Add a new task..."
            />
            <button onClick={addTask}>Add</button>
          </div>
        </header>
        <ul>
          {tasks.map((t) => (
            <li key={t._id} className={t.completed ? "completed" : ""}>
              {editTaskId === t._id ? (
                <div>
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                  />
                  <button onClick={saveEditTask}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <span onClick={() => toggleTask(t._id, t.completed)}>
                    {t.text}
                  </span>
                  <div>
                    <button onClick={() => startEditTask(t._id, t.text)}>
                      Edit
                    </button>
                    <button onClick={() => deleteTask(t._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;
