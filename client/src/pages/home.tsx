import { useEffect, useState, useMemo } from 'react'; 
import { Link } from 'react-router-dom'; 

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  status: string;
  start_date: string;
}

// 1. Define a type for our sorting configuration
type SortConfig = {
  key: keyof Employee;
  direction: 'asc' | 'desc';
} | null;

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // 2. Add state to track sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'status', direction: 'desc' });

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
    if(!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await fetch(`http://localhost:5000/employees/${id}`, { method: "DELETE" });
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Sorting Logic
  const sortedEmployees = useMemo(() => {
    let sortableItems = [...employees]; // Create a copy so we don't mutate original state
    
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Handle null values safely
        const aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
        const bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [employees, sortConfig]);

  // 4. Function to handle header clicks
  const requestSort = (key: keyof Employee) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    // If we are already sorting by this key and it's asc, flip to desc
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 5. Helper to show arrows (↑ ↓)
  const getSortIndicator = (key: keyof Employee) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#d4edda';
      case 'Onboarding': return '#fff3cd'; 
      case 'Pre-boarding': return '#e2e3e5';
      case 'Hold': return '#f8d7da';
      default: return 'white';
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '20px' }}>Onboarding Dashboard</h1>
      
      <Link to="/add">
        <button style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: 'var(--btn-primary)', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          + Onboard New Employee
        </button>
      </Link>

      <table border={0} cellPadding={15} style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--table-header-bg)', color: '#fff', textAlign: 'left' }}>
            {/* UPDATED HEADERS: Added onClick and cursor pointer */}
            <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
              Name {getSortIndicator('name')}
            </th>
            <th onClick={() => requestSort('role')} style={{ cursor: 'pointer' }}>
              Role {getSortIndicator('role')}
            </th>
            <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>
              Email {getSortIndicator('email')}
            </th>
            <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}>
              Status {getSortIndicator('status')}
            </th>
            <th onClick={() => requestSort('start_date')} style={{ cursor: 'pointer' }}>
              Start Date {getSortIndicator('start_date')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* RENDER THE SORTED LIST INSTEAD OF ORIGINAL */}
          {sortedEmployees.map((emp) => (
            <tr key={emp.id} style={{ borderBottom: '1px solid var(--table-border)' }}>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{emp.email}</td>
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