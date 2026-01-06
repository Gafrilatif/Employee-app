import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/home';
import AddEmployee from './pages/addEmployee';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark');

  // Toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Update the HTML body class when theme changes
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  return (
    <div>
      {/* GLOBAL THEME TOGGLE BUTTON */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={toggleTheme} 
          style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '5px' }}
        >
          {theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEmployee />} />
        <Route path="/edit/:id" element={<AddEmployee />} />
      </Routes>
    </div>
  );
}

export default App;