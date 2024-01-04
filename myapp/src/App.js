// App.js
import React from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css'

function App() {
  return (
    <div className='container-task'>
      <h2 className='heading-main'>TASK MANAGER</h2>
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default App;
