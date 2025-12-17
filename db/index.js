const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST,        // e.g. pg-1924eeae-expressdb.f.aivencloud.com
  port: process.env.PGPORT,        // e.g. 20101
  database: process.env.PGDATABASE, // e.g. defaultdb
  user: process.env.PGUSER,        // e.g. avnadmin
  password: process.env.PGPASSWORD, // your Aiven password
  ssl: { rejectUnauthorized: false } // Aiven requires SSL
});

module.exports = pool;
