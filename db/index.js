const { Pool } = require('pg');

const pool = new Pool({
  user: 'devmicah',
  host: 'localhost',
  database: 'devmicah',
  password: 'micahtadiwapirikisi', // the password you set
  port: 5432,
});

module.exports = pool;

