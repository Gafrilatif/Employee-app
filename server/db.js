const { Pool } = require('pg');

// REPLACE THIS with your actual connection string from Supabase or Localhost
const pool = new Pool({
  connectionString: 'postgresql://postgres:168533Bettaman@db.srzupmqrilxoohilxrvt.supabase.co:5432/postgres',
});

module.exports = pool;