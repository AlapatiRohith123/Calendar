import React from 'react';
import Calendar from './components/Calendar';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Team Calendar</h1>
        <p className="app-subtitle">Manage your team events and schedule</p>
      </header>
      <main className="app-main">
        <Calendar />
      </main>
    </div>
  );
};

export default App;
