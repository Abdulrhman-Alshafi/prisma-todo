import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem";

const API = "http://localhost:4000/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      setError("Failed to load todos. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newTodo = await res.json();
      setTodos((prev) => [newTodo, ...prev]);
      setTitle("");
    } catch (err) {
      console.error("Failed to add todo:", err);
      setError("Failed to add todo.");
    }
  }

  async function toggleTodo(id, completed) {
    if (!id) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Refresh the list
      loadTodos();
    } catch (err) {
      console.error("Failed to toggle todo:", err);
      setError("Failed to update todo.");
    }
  }

  async function deleteTodo(id) {
    if (!id) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setError("Failed to delete todo.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo"
          className="flex-1 border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>

      {loading ? (
        <p>Loading todos...</p>
      ) : (
        <div>
          {todos.length === 0 ? (
            <p className="text-gray-500">No todos yet.</p>
          ) : (
            todos.map((t) => (
              <TodoItem
                key={t.id}
                todo={t}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
