const pool = require("../db");

// Render all films
exports.getAllFilms = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM films ORDER BY film_id");
    res.render("films/index", { films: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Render single film
exports.getFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM films WHERE film_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Film not found");
    }
    res.render("films/show", { film: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// GET all films
exports.getAllFilms = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM films ORDER BY film_id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// GET one film by ID
exports.getFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM films WHERE film_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Film not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// CREATE a new film
exports.createFilm = async (req, res) => {
  const {
    title,
    release_year,
    duration_minutes,
    rating,
    category_id,
    description,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO films (title, release_year, duration_minutes, rating, category_id, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, release_year, duration_minutes, rating, category_id, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// UPDATE a film
exports.updateFilm = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    release_year,
    duration_minutes,
    rating,
    category_id,
    description,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE films
       SET title = $1, release_year = $2, duration_minutes = $3, rating = $4, category_id = $5, description = $6
       WHERE film_id = $7 RETURNING *`,
      [
        title,
        release_year,
        duration_minutes,
        rating,
        category_id,
        description,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Film not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE a film
exports.deleteFilm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM films WHERE film_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Film not found");
    }
    res.send(`Film ${id} deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
