const pool = require("../db");

// GET all directors
exports.getAllDirectors = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM directors ORDER BY director_id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// GET one director by ID
exports.getDirectorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM directors WHERE director_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Director not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// CREATE a new director
exports.createDirector = async (req, res) => {
  const { name, birth_year, nationality } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO directors (name, birth_year, nationality) VALUES ($1, $2, $3) RETURNING *",
      [name, birth_year, nationality]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// UPDATE a director
exports.updateDirector = async (req, res) => {
  const { id } = req.params;
  const { name, birth_year, nationality } = req.body;
  try {
    const result = await pool.query(
      "UPDATE directors SET name = $1, birth_year = $2, nationality = $3 WHERE director_id = $4 RETURNING *",
      [name, birth_year, nationality, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Director not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE a director
exports.deleteDirector = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM directors WHERE director_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Director not found");
    }
    res.send(`Director ${id} deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
