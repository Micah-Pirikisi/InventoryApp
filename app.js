const express = require("express");
const pool = require("./db");

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the Inventory App!');
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
