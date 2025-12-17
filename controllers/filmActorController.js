const pool = require("../db");

// Add actor to film
exports.addActorToFilm = async (req, res) => {
  const { id } = req.params; // film_id
  const { actor_id } = req.body;

  // Guard check
  if (!actor_id) {
    return res.status(400).send("Actor ID required");
  }

  try {
    const result = await pool.query(
      "INSERT INTO film_actors (film_id, actor_id) VALUES ($1, $2) RETURNING *",
      [id, actor_id]
    );
    res.redirect(`/films/${id}`);
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
    res.redirect(`/films/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
