import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 

export default function AddEmployee() {
  const [formData, setFormData] = useState({ name: "", role: "", email: "" });
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditing = Boolean(id); 

  useEffect(() => {
    if (isEditing) {
      const getEmployee = async () => {
        const res = await fetch(`http://localhost:5000/employees`);
        const data = await res.json();
        const employee = data.find((emp: any) => emp.id === Number(id));
        
        if (employee) {
          setFormData({ name: employee.name, role: employee.role, email: employee.email });
        }
      };
      getEmployee();
    }
  }, [id, isEditing]);

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetch(`http://localhost:5000/employees/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch("http://localhost:5000/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }
      navigate("/"); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>{isEditing ? "Edit Employee" : "Add New Employee"}</h1>
      
      <form onSubmit={onSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input 
          type="text" placeholder="Name" required 
          value={formData.name} 
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          style={{ padding: '10px' }}
        />
        <input 
          type="text" placeholder="Role" required 
          value={formData.role} 
          onChange={e => setFormData({ ...formData, role: e.target.value })}
          style={{ padding: '10px' }}
        />
        <input 
          type="email" placeholder="Email" required 
          value={formData.email} 
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: isEditing ? 'orange' : 'blue', color: 'white' }}>
          {isEditing ? "Update Details" : "Add Employee"}
        </button>
      </form>
    </div>
  );
}