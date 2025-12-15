const pool = require("../db");

// GET all actors
exports.getAllActors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM actors ORDER BY actor_id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// GET one actor by ID
exports.getActorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM actors WHERE actor_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Actor not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// CREATE a new actor
exports.createActor = async (req, res) => {
  const { name, birth_year, nationality } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO actors (name, birth_year, nationality) VALUES ($1, $2, $3) RETURNING *",
      [name, birth_year, nationality]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// UPDATE an actor
exports.updateActor = async (req, res) => {
  const { id } = req.params;
  const { name, birth_year, nationality } = req.body;
  try {
    const result = await pool.query(
      "UPDATE actors SET name = $1, birth_year = $2, nationality = $3 WHERE actor_id = $4 RETURNING *",
      [name, birth_year, nationality, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Actor not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE an actor
exports.deleteActor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM actors WHERE actor_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Actor not found");
    }
    res.send(`Actor ${id} deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
