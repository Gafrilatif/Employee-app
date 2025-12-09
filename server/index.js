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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});