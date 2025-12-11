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
  const [search, setSearch] = useState("");
  
  const [formData, setFormData] = useState({ name: "", role: "", email: "" });
  const [editingId, setEditingId] = useState<number | null>(null); 

  const getEmployees = async (searchTerm = "") => {
    try {
      const url = searchTerm 
        ? `http://localhost:5000/employees?name=${searchTerm}` 
        : `http://localhost:5000/employees`;
      const response = await fetch(url);
      const jsonData = await response.json();
      setEmployees(jsonData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { getEmployees(); }, []);

  const deleteEmployee = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/employees/${id}`, { method: "DELETE" });
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`http://localhost:5000/employees/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        setEditingId(null); 
      } else {
        await fetch("http://localhost:5000/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }
      
      setFormData({ name: "", role: "", email: "" });
      getEmployees();
      
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (emp: Employee) => {
    setEditingId(emp.id);
    setFormData({ name: emp.name, role: emp.role, email: emp.email });
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>Employee Management</h1>

      {/* --- THE INPUT FORM --- */}
      <div style={{ backgroundColor: '#222', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
        <h3>{editingId ? "Edit Employee" : "Add New Employee"}</h3>
        <form onSubmit={onSubmitForm} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" placeholder="Name" required 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <input 
            type="text" placeholder="Role" required 
            value={formData.role} 
            onChange={e => setFormData({ ...formData, role: e.target.value })}
          />
          <input 
            type="email" placeholder="Email" required 
            value={formData.email} 
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <button type="submit" style={{ backgroundColor: 'green', color: 'white' }}>
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && <button onClick={() => { setEditingId(null); setFormData({name:"", role:"", email:""}) }}>Cancel</button>}
        </form>
      </div>

      {/* --- SEARCH BAR --- */}
      <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); getEmployees(e.target.value); }}
          style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />

      {/* --- TABLE --- */}
      <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%', borderColor: '#444' }}>
        <thead>
          <tr style={{ backgroundColor: '#333', textAlign: 'left' }}>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{emp.email}</td>
              <td>
                <button 
                  onClick={() => startEditing(emp)}
                  style={{ marginRight: '10px', backgroundColor: '#dda0dd', color: 'black' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteEmployee(emp.id)}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;