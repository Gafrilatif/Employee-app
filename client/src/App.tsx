import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AddEmployee from './pages/addEmployee';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<AddEmployee />} />
      
      {}
      <Route path="/edit/:id" element={<AddEmployee />} />
    </Routes>
  );
}

export default App;