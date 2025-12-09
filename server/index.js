const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow React (port 5173) to talk to Node (port 5000)
app.use(express.json());

// ROUTE: Get all employees
// server/index.js

app.get('/employees', async (req, res) => {
  try {
    // 1. Get the 'name' from the URL (req.query)
    const { name } = req.query; 

    // 2. Build the Query logic
    // If name is provided, search for it using ILIKE (Case-insensitive search).
    // If not, just select all.
    // The || operator connects the '%' wildcards to the search term.
    
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