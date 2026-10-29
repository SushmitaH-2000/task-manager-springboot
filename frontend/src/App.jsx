
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8080/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingIds, setUpdatingIds] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const [error, setError] = useState('');

  // Fetch all tasks from Spring Boot
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error('Fetch tasks failed:', err);
      setError(
        'Cannot connect to backend. Check Spring Boot on port 8080.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || saving) return;

    setSaving(true);
    setError('');

    try {
      const response = await axios.post(API_URL, {
        title: trimmedTitle,
        completed: false,
      });

      setTasks((current) => [...current, response.data]);
      setTitle('');
    } catch (err) {
      console.error('Add task failed:', err);
      setError('Unable to save task. Check the backend console.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle completion and update React state from the saved response
  const toggleTask = async (task) => {
    if (
      task.id == null ||
      updatingIds.includes(task.id)
    ) {
      return;
    }

    setError('');
    setUpdatingIds((current) => [...current, task.id]);

    try {
      const response = await axios.patch(
        `${API_URL}/${task.id}/toggle`
      );

      const updatedTask = response.data;

      setTasks((current) =>
        current.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        )
      );
    } catch (err) {
      console.error('Toggle task failed:', err);
      setError('Unable to update task status. Please try again.');
    } finally {
      setUpdatingIds((current) =>
        current.filter((id) => id !== task.id)
      );
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    if (id == null || deletingIds.includes(id)) return;

    setError('');
    setDeletingIds((current) => [...current, id]);

    try {
      await axios.delete(`${API_URL}/${id}`);

      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );
    } catch (err) {
      console.error('Delete task failed:', err);
      setError('Unable to delete task. Please try again.');
    } finally {
      setDeletingIds((current) =>
        current.filter((itemId) => itemId !== id)
      );
    }
  };

  // Calculate dashboard statistics from the latest task state
  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = tasks.length - completed;

  const completionRate = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  // Search and filter tasks
  const filteredTasks = tasks.filter((task) => {
    const taskTitle = (task.title || '').toLowerCase();
    const searchTerm = search.toLowerCase();

    const matchesSearch = taskTitle.includes(searchTerm);

    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <div>
            <h1>Task Manager</h1>
            <span>React + Spring Boot</span>
          </div>
        </div>

        <div className="connection">
          <span className="live-dot" />
          API Task Manager
        </div>
      </header>

      <main className="dashboard">
        {/* Welcome section */}
        <section className="welcome-panel">
          <div className="welcome-icon">✦</div>
          <div>
            <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
            <h2>Make today productive.</h2>
            <p>
              Plan your work, track progress, and celebrate every win.
            </p>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Dashboard statistics */}
        <section className="stats-grid">
          <article className="stat-card blue">
            <span className="stat-icon">▤</span>
            <p>Total tasks</p>
            <strong>{tasks.length}</strong>
            <span className="stat-note">All your tasks</span>
          </article>

          <article className="stat-card green">
            <span className="stat-icon">✓</span>
            <p>Completed</p>
            <strong>{completed}</strong>
            <span className="stat-note">Great progress!</span>
          </article>

          <article className="stat-card orange">
            <span className="stat-icon">◷</span>
            <p>Pending</p>
            <strong>{pending}</strong>
            <span className="stat-note">Ready to tackle</span>
          </article>

          <article className="stat-card purple">
            <span className="stat-icon">↗</span>
            <p>Completion</p>
            <strong>{completionRate}%</strong>

            <div
              className="progress-track"
              role="progressbar"
              aria-label="Task completion"
              aria-valuenow={completionRate}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </article>
        </section>

        {/* Add task form */}
        <section className="content-card add-card">
          <div className="section-heading">
            <span className="heading-icon">＋</span>
            <div>
              <h3>Add a new task</h3>
              <p>Small steps lead to big results.</p>
            </div>
          </div>

          <form className="add-form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="What do you need to do?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              aria-label="New task title"
              required
            />

            <button
              type="submit"
              className="primary-btn"
              disabled={saving || !title.trim()}
            >
              {saving ? 'Adding...' : '+ Add Task'}
            </button>
          </form>
        </section>

        {/* Task list */}
        <section className="content-card task-card">
          <div className="task-toolbar">
            <div>
              <h3>Your tasks</h3>
              <p>{pending} tasks left to complete</p>
            </div>

            <button
              type="button"
              className="refresh-btn"
              onClick={fetchTasks}
              disabled={loading}
            >
              ↻ {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Search and filters */}
          <div className="task-controls">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tasks"
              />
            </div>

            <div className="filter-tabs">
              {['all', 'pending', 'completed'].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={
                    filter === option
                      ? 'filter-btn active'
                      : 'filter-btn'
                  }
                  onClick={() => setFilter(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◌</div>
              <h3>Loading your tasks...</h3>
              <p>Please wait while tasks are loaded.</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                {search ? '⌕' : '✓'}
              </div>
              <h3>
                {search
                  ? 'No matching tasks'
                  : filter === 'completed'
                    ? 'No completed tasks yet'
                    : filter === 'pending'
                      ? 'No pending tasks'
                      : 'Nothing here yet'}
              </h3>
              <p>
                {search
                  ? 'Try another search term.'
                  : filter !== 'all'
                    ? 'Try another filter or add a new task.'
                    : 'Add a task above to get started.'}
              </p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <article
                  className={`task-row ${
                    task.completed ? 'is-complete' : ''
                  }`}
                  key={task.id ?? `missing-id-${task.title}`}
                >
                  <button
                    type="button"
                    className={`task-check ${
                      task.completed ? 'checked' : ''
                    }`}
                    onClick={() => toggleTask(task)}
                    disabled={
                      task.id == null ||
                      updatingIds.includes(task.id)
                    }
                    aria-label={
                      task.completed
                        ? `Mark ${task.title} pending`
                        : `Complete ${task.title}`
                    }
                    aria-pressed={Boolean(task.completed)}
                    title={
                      updatingIds.includes(task.id)
                        ? 'Updating...'
                        : 'Toggle completion'
                    }
                  >
                    {updatingIds.includes(task.id)
                      ? '…'
                      : task.completed
                        ? '✓'
                        : ''}
                  </button>

                  <div className="task-details">
                    <span className="task-title">
                      {task.title}
                    </span>

                    <span
                      className={`status-pill ${
                        task.completed ? 'done' : 'pending-pill'
                      }`}
                    >
                      {task.completed ? 'Completed' : 'In progress'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                    disabled={
                      task.id == null ||
                      deletingIds.includes(task.id)
                    }
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    {deletingIds.includes(task.id) ? '…' : '🗑'}
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="list-footer">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </section>

        <footer className="page-footer">
          <span>Built with React &amp; Spring Boot</span>
          <span>One task at a time. ✨</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
