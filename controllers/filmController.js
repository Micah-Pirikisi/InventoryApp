const pool = require("../db");

// Render all films
exports.getAllFilms = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM films ORDER BY film_id");
    res.render("films/index", { title: "Films", films: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Render single film with actors and directors
exports.getFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const filmResult = await pool.query(
      "SELECT * FROM films WHERE film_id = $1",
      [id]
    );
    if (filmResult.rows.length === 0) {
      return res.status(404).send("Film not found");
    }
    const film = filmResult.rows[0];

    const directorResult = await pool.query(
      `SELECT d.* 
       FROM directors d
       JOIN film_directors fd ON d.director_id = fd.director_id
       WHERE fd.film_id = $1`,
      [id]
    );

    const actorResult = await pool.query(
      `SELECT a.* 
       FROM actors a
       JOIN film_actors fa ON a.actor_id = fa.actor_id
       WHERE fa.film_id = $1`,
      [id]
    );

    const allDirectorsResult = await pool.query(
      "SELECT * FROM directors ORDER BY name"
    );
    const allActorsResult = await pool.query(
      "SELECT * FROM actors ORDER BY name"
    );

    res.render("films/show", {
      title: film.title,
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
    poster_url,
  } = req.body;

  // Use uploaded file if present, otherwise use URL
  const posterPath = req.file ? `/posters/${req.file.filename}` : poster_url;

  try {
    await pool.query(
      "INSERT INTO films (title, release_year, duration_minutes, rating, category_id, description, poster_url) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        title,
        release_year,
        duration_minutes,
        rating,
        category_id,
        description,
        posterPath,
      ]
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
    res.render("films/new", { title: "New Film", categories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// EDIT FILM FORM
exports.editFilmForm = async (req, res) => {
  const { id } = req.params;
  try {
    const filmResult = await pool.query(
      "SELECT * FROM films WHERE film_id = $1",
      [id]
    );
    if (filmResult.rows.length === 0) {
      return res.status(404).send("Film not found");
    }
    const film = filmResult.rows[0];

    // You’ll probably want categories for the dropdown
    const categoriesResult = await pool.query(
      "SELECT * FROM categories ORDER BY name"
    );

    res.render("films/edit", {
      title: "Edit Film",
      film,
      categories: categoriesResult.rows,
    });
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
    poster_url,
  } = req.body;

  // Use uploaded file if present, otherwise use URL
  const posterPath = req.file ? `/posters/${req.file.filename}` : poster_url;

  try {
    await pool.query(
      "UPDATE films SET title=$1, release_year=$2, duration_minutes=$3, rating=$4, category_id=$5, description=$6, poster_url=$7 WHERE film_id=$8",
      [
        title,
        release_year,
        duration_minutes,
        rating,
        category_id,
        description,
        posterPath,
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
