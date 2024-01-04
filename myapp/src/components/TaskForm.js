// TaskForm.js
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTask } from '../Redux/actions';

const TaskForm = ({ addTask }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (taskTitle.trim() !== '') {
      // Create a new task object for the API request
      const newTask = {
        title: taskTitle,
      };

      try {
        // Use the correct fetch syntax to add a new task to the server
        const response = await fetch('http://localhost:8080/api/v1/toDoList/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
        });

        if (response.ok) {
          // If the server request is successful, update the local state immediately
          const addedTask = await response.json();
          addTask(addedTask);
        } else {
          console.error('Failed to add task to the server');
        }
      } catch (error) {
        console.error(error);
      }

      // Reset the input field
      setTaskTitle('');
    }
  };

  return (
    <div className="task-form">
      <input
        type="text"
        placeholder="Enter task title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

const mapDispatchToProps = {
  addTask,
};

export default connect(null, mapDispatchToProps)(TaskForm);
