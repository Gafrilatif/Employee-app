import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 

// 1. Update Interface to match new DB columns
interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  status: string;      // NEW
  start_date: string;  // NEW
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const getEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/employees");
      const jsonData = await response.json();
      setEmployees(jsonData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { getEmployees(); }, []);

  const deleteEmployee = async (id: number) => {
    try {
      // Add a confirmation before deleting
      if(!window.confirm("Are you sure you want to delete this employee?")) return;

      await fetch(`http://localhost:5000/employees/${id}`, { method: "DELETE" });
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Helper function for Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#d4edda';       // Greenish
      case 'Onboarding': return '#fff3cd';   // Yellowish
      case 'Pre-boarding': return '#e2e3e5'; // Greyish
      case 'Hold': return '#f8d7da';         // Reddish
      default: return 'white';
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '20px' }}>Onboarding Dashboard</h1>
      
      <Link to="/add">
        <button style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          + Onboard New Employee
        </button>
      </Link>

      <table border={0} cellPadding={15} style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#343a40', color: 'white', textAlign: 'left' }}>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Status</th>      {/* NEW HEADER */}
            <th>Start Date</th>  {/* NEW HEADER */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{emp.email}</td>
              
              {/* NEW: Status Badge */}
              <td>
                <span style={{ 
                  backgroundColor: getStatusColor(emp.status),
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  color: '#495057'
                }}>
                  {emp.status || 'Pre-boarding'}
                </span>
              </td>

              {/* NEW: Formatted Date */}
              <td>
                {emp.start_date ? new Date(emp.start_date).toLocaleDateString() : '-'}
              </td>

              <td>
                <Link to={`/edit/${emp.id}`}>
                    <button style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Edit
                    </button>
                </Link>
                
                <button onClick={() => deleteEmployee(emp.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
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