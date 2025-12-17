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

// Render single film with actors and directors
exports.getFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    // Get the film itself
    const filmResult = await pool.query(
      "SELECT * FROM films WHERE film_id = $1",
      [id]
    );
    if (filmResult.rows.length === 0) {
      return res.status(404).send("Film not found");
    }
    const film = filmResult.rows[0];

    // Get linked directors
    const directorResult = await pool.query(
      `SELECT d.* 
       FROM directors d
       JOIN film_directors fd ON d.director_id = fd.director_id
       WHERE fd.film_id = $1`,
      [id]
    );

    // Get linked actors
    const actorResult = await pool.query(
      `SELECT a.* 
       FROM actors a
       JOIN film_actors fa ON a.actor_id = fa.actor_id
       WHERE fa.film_id = $1`,
      [id]
    );

    // Get all directors (for dropdown)
    const allDirectorsResult = await pool.query(
      "SELECT * FROM directors ORDER BY name"
    );

    // Get all actors (for dropdown)
    const allActorsResult = await pool.query(
      "SELECT * FROM actors ORDER BY name"
    );

    // Render the view with all data
    res.render("films/show", {
      film,
      directors: directorResult.rows,
      actors: actorResult.rows,
      allDirectors: allDirectorsResult.rows,
      allActors: allActorsResult.rows,
    });
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
    await pool.query(
      "INSERT INTO films (title, release_year, duration_minutes, rating, category_id, description) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, release_year, duration_minutes, rating, category_id, description]
    );
    res.redirect("/films");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// NEW FILM FORM
exports.newFilmForm = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.render("films/new", { categories: result.rows });
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
    await pool.query(
      "UPDATE films SET title=$1, release_year=$2, duration_minutes=$3, rating=$4, category_id=$5, description=$6 WHERE film_id=$7",
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
    res.redirect(`/films/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE a film
exports.deleteFilm = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM films WHERE film_id = $1", [id]);
    res.redirect("/films");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
