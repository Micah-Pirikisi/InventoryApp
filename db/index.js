const { Pool } = require('pg');

const pool = new Pool({
  user: 'inventory_user',
  host: 'localhost',
  database: 'inventory_app',
  password: 'micahtadiwapirikisi', // the password you set
  port: 5432,
});

module.exports = pool;

