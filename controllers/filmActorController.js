const pool = require("../db");

// Add actor to film
exports.addActorToFilm = async (req, res) => {
  const { id } = req.params; // film_id
  const { actorId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO film_actors (film_id, actor_id) VALUES ($1, $2) RETURNING *",
      [id, actorId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Remove actor from film
exports.removeActorFromFilm = async (req, res) => {
  const { id, actorId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM film_actors WHERE film_id = $1 AND actor_id = $2 RETURNING *",
      [id, actorId]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Relation not found");
    }
    res.send(`Actor ${actorId} removed from film ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
