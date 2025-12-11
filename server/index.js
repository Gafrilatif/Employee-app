const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json());

app.get('/employees', async (req, res) => {
  try {
    const { name } = req.query; 
    
    let queryText = 'SELECT * FROM employees';
    let queryParams = [];

    if (name) {
      queryText += " WHERE name ILIKE '%' || $1 || '%'";
      queryParams.push(name);
    }

    const allEmployees = await pool.query(queryText, queryParams);
    
    res.json(allEmployees.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/employees', async (req, res) => {
  try {
    const { name, role, email } = req.body; 
    const newEmployee = await pool.query(
      'INSERT INTO employees (name, role, email) VALUES ($1, $2, $3) RETURNING *',
      [name, role, email]
    );
    res.json(newEmployee.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, role, email } = req.body; 
    const updateEmployee = await pool.query(
      'UPDATE employees SET name = $1, role = $2, email = $3 WHERE id = $4',
      [name, role, email, id]
    );
    res.json('Employee was updated!');
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await pool.query("SELECT * FROM employees WHERE id = $1", [id]);
    res.json(employee.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEmployee = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json('Employee was deleted!');
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});