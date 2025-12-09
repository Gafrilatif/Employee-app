import { useEffect, useState } from 'react';
import './index.css'; 

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState(""); // New State for the input box

  const getEmployees = async (searchTerm = "") => {
    try {
      // If there is a search term, add it to the URL. If not, fetch all.
      const url = searchTerm 
        ? `http://localhost:5000/employees?name=${searchTerm}` 
        : `http://localhost:5000/employees`;

      const response = await fetch(url);
      const jsonData = await response.json();
      setEmployees(jsonData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Initial load (fetch all)
  useEffect(() => {
    getEmployees();
  }, []);

  // Handle Form Submit (When user hits Enter or clicks Search)
  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault(); // Stop page refresh
    getEmployees(search); // Call API with the search text
  };

  return (
    <div style={{ padding: '50px', backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      <h1>Employee List</h1>

      {/* SEARCH BAR */}
      <form onSubmit={onSubmitForm} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '200px' }}
        />
        <button type="submit" style={{ padding: '8px', marginLeft: '5px' }}>
          Search
        </button>
      </form>

      {/* TABLE */}
      <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#333', textAlign: 'left', color: 'white' }}>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{emp.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;