import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
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
      await fetch(`http://localhost:5000/employees/${id}`, { method: "DELETE" });
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Employee List</h1>
      {/* BUTTON TO GO TO ADD PAGE */}
      <Link to="/add">
        <button style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'green' }}>
          + Add New Employee
        </button>
      </Link>

      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#444' }}>
        <thead>
          <tr style={{ backgroundColor: '#333' }}>
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
                {/* CHANGED: Wrap the Edit button in a Link */}
                <Link to={`/edit/${emp.id}`}>
                    <button style={{ marginRight: '10px', backgroundColor: '#dda0dd', color: 'black' }}>
                    Edit
                    </button>
                </Link>
                
                <button onClick={() => deleteEmployee(emp.id)} style={{ backgroundColor: 'red' }}>
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