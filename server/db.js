const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:168533Bettaman@db.srzupmqrilxoohilxrvt.supabase.co:5432/postgres',
});

module.exports = pool;