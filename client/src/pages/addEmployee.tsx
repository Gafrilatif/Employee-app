import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 

export default function AddEmployee() {
  // 1. Added status and start_date to state
  const [formData, setFormData] = useState({ 
    name: "", 
    role: "", 
    email: "", 
    status: "Pre-boarding", 
    start_date: new Date().toISOString().split('T')[0] 
  });
  
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditing = Boolean(id); 

  useEffect(() => {
    if (isEditing) {
      const getEmployee = async () => {
        const res = await fetch(`http://localhost:5000/employees/${id}`);
        const employee = await res.json();
        
        if (employee) {
          setFormData({ 
            name: employee.name, 
            role: employee.role, 
            email: employee.email,
            // Handle nulls if old data doesn't have these fields yet
            status: employee.status || "Pre-boarding",
            start_date: employee.start_date ? employee.start_date.split('T')[0] : ""
          });
        }
      };
      getEmployee();
    }
  }, [id, isEditing]);

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/employees/${id}` 
        : "http://localhost:5000/employees";
      
      const method = isEditing ? "PUT" : "POST";

      await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      navigate("/"); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>{isEditing ? "Edit Onboarding Status" : "Onboard New Employee"}</h1>
      
      <form onSubmit={onSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        
        <label>Full Name</label>
        <input 
          type="text" required 
          value={formData.name} 
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          style={{ padding: '10px' }}
        />

        <label>Role / Position</label>
        <input 
          type="text" required 
          value={formData.role} 
          onChange={e => setFormData({ ...formData, role: e.target.value })}
          style={{ padding: '10px' }}
        />

        <label>Email Address</label>
        <input 
          type="email" required 
          value={formData.email} 
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          style={{ padding: '10px' }}
        />

        {/* NEW: Status Dropdown */}
        <label>Onboarding Status</label>
        <select 
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          style={{ padding: '10px' }}
        >
          <option value="Pre-boarding">Pre-boarding (Not Started)</option>
          <option value="Onboarding">Onboarding (In Progress)</option>
          <option value="Active">Active (Completed)</option>
          <option value="Hold">On Hold</option>
        </select>

        {/* NEW: Date Picker */}
        <label>Start Date</label>
        <input 
          type="date" 
          value={formData.start_date}
          onChange={e => setFormData({ ...formData, start_date: e.target.value })}
          style={{ padding: '10px' }}
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: isEditing ? 'orange' : 'blue', color: 'white', marginTop: '10px' }}>
          {isEditing ? "Update Status" : "Start Onboarding"}
        </button>
      </form>
    </div>
  );
}