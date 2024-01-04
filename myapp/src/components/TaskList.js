// TaskList.js
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { deleteTask, toggleTask, editTask, addTask } from '../Redux/actions';

const TaskList = ({ tasks, deleteTask, toggleTask, editTask, addTask }) => {
  const [editableTaskId, setEditableTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [originalTasks, setOriginalTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/toDoList/list');
        const data = await response.json();
        setOriginalTasks(data);
        setFilteredTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [tasks]);

  const handleEditStart = (taskId, title) => {
    setEditableTaskId(taskId);
    setEditedTaskTitle(title);
  };

  const handleEditCancel = () => {
    setEditableTaskId(null);
    setEditedTaskTitle('');
  };

  const handleEditSave = async (taskId) => {
    if (editedTaskTitle.trim() !== '') {
      try {
        const updatedTask = {
          title: editedTaskTitle,
        };

        await fetch(`http://localhost:8080/api/v1/toDoList/update/${taskId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });

        editTask(taskId, { title: editedTaskTitle });

        setFilteredTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, title: editedTaskTitle } : task
          )
        );

        setEditableTaskId(null);
        setEditedTaskTitle('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

      await fetch(`http://localhost:8080/api/v1/toDoList/update/status/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      toggleTask(taskId);

      setFilteredTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Make an API call to delete the task
      await fetch(`http://localhost:8080/api/v1/toDoList/delete/${taskId}`, {
        method: 'DELETE',
      });

      // Dispatch the deleteTask action for local state management
      deleteTask(taskId);

      // Update the local state by removing the deleted task
      setFilteredTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleFilter = (statusBtn) => {
    try {
      let filtered;

      if (statusBtn) {
        // If statusBtn is truthy (completed or pending), filter based on it
        filtered = originalTasks.filter((task) => task.status === statusBtn);
      } else {
        // If statusBtn is falsy (null), show all tasks
        filtered = originalTasks;
      }

      setFilteredTasks(filtered);
    } catch (error) {
      console.error('Error filtering tasks:', error);
    }
  };

  return (
    <div className="container">
      <div>
        <h3>Task List</h3>
        <div className="filter-buttons">
          <button onClick={() => handleToggleFilter(null)}>Show All</button>
          <button onClick={() => handleToggleFilter('completed')}>Show Completed</button>
          <button onClick={() => handleToggleFilter('pending')}>Show Incomplete</button>
        </div>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task._id} className="task-item">
            {editableTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editedTaskTitle}
                  onChange={(e) => setEditedTaskTitle(e.target.value)}
                />
                <button onClick={() => handleEditSave(task._id)}>Save</button>
                <button onClick={handleEditCancel}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </span>
                <button onClick={() => handleEditStart(task._id, task.title)}>
                  Edit
                </button>
                <button onClick={() => handleToggleTask(task._id, task.status)}>
                  {task.status === 'completed' ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  tasks: state.tasks,
});

const mapDispatchToProps = {
  deleteTask,
  toggleTask,
  editTask,
  addTask,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
