const pool = require("../db");

// Add director to film
exports.addDirectorToFilm = async (req, res) => {
  const { id } = req.params; // film_id
  const { directorId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO film_directors (film_id, director_id) VALUES ($1, $2) RETURNING *",
      [id, directorId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Remove director from film
exports.removeDirectorFromFilm = async (req, res) => {
  const { id, directorId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM film_directors WHERE film_id = $1 AND director_id = $2 RETURNING *",
      [id, directorId]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Relation not found");
    }
    res.send(`Director ${directorId} removed from film ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
