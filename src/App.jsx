import React,{ useEffect, useState } from "react";
import FilterButtons from "./components/FilterButtons.jsx";
import StatusMessage from "./components/StatusMessage.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import TodoSummary from "./components/TodoSummary.jsx";
import WeatherSection from "./components/WeatherSection.jsx";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/taskApi.js";
import { filterTasks } from "./utils/taskUtils.js";

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const buttonVariant = import.meta.env.VITE_BUTTON_VARIANT === "B" ? "B" : "A";
  const visibleTasks = filterTasks(tasks, selectedFilter);

  const loadTasks = async () => {
    setIsLoading(true);
    setError("");

    try {
      const savedTasks = await getTasks();
      setTasks(savedTasks);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (title) => {
    setIsSaving(true);
    setError("");

    try {
      const newTask = await createTask(title);
      setTasks((currentTasks) => [...currentTasks, newTask]);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTask = async (task) => {
    setError("");

    try {
      const updatedTask = await updateTask(task.id, {
        completed: !task.completed,
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? updatedTask : currentTask,
        ),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteTask = async (id) => {
    setError("");

    try {
      await deleteTask(id);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="app-shell">
      <div className="page-content">
        <WeatherSection />

        <section className="todo-card" aria-labelledby="page-title">
          <header className="app-header">
            <p className="eyebrow">MIN PLANERING</p>
            <h1 id="page-title">Todo-lista</h1>
            <p>Samla dagens uppgifter och bocka av dem i lugn och ro.</p>
          </header>

          <TodoForm
            onAddTask={handleAddTask}
            isSaving={isSaving}
            buttonVariant={buttonVariant}
          />

          <FilterButtons
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          {error && (
            <StatusMessage type="error">
              <span>{error}</span>
              <button type="button" className="retry-button" onClick={loadTasks}>
                Försök igen
              </button>
            </StatusMessage>
          )}

          {isLoading ? (
            <StatusMessage>Laddar uppgifter…</StatusMessage>
          ) : (
            <TodoList
              tasks={visibleTasks}
              hasAnyTasks={tasks.length > 0}
              selectedFilter={selectedFilter}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          <TodoSummary tasks={tasks} />
        </section>
      </div>
    </main>
  );
}

export default App;
