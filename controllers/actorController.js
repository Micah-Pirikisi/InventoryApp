const pool = require("../db");

// Render all actors
exports.getAllActors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM actors ORDER BY actor_id");
    res.render("actors/index", {
      title: "Actors",
      actors: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Render single actor
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
    const actor = result.rows[0];
    res.render("actors/show", {
      title: actor.name,
      actor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// CREATE a new actor
exports.createActor = async (req, res) => {
  const { name, birth_year, nationality, image_url } = req.body;
  const birthYear =
    birth_year && birth_year.toString().trim() !== ""
      ? parseInt(birth_year, 10)
      : null;

  // Debug: log incoming multipart body and file
  console.log("DEBUG createActor - req.body:", req.body);
  console.log("DEBUG createActor - req.file:", req.file);

  // Use uploaded file if present, otherwise use URL
  const imagePath = req.file ? `/profiles/${req.file.filename}` : image_url;

  try {
    await pool.query(
      "INSERT INTO actors (name, birth_year, nationality, image_url) VALUES ($1, $2, $3, $4)",
      [name, birthYear, nationality, imagePath]
    );
    res.redirect("/actors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// UPDATE an actor
exports.updateActor = async (req, res) => {
  const { id } = req.params;
  const { name, birth_year, nationality, image_url } = req.body;
  const birthYear =
    birth_year && birth_year.toString().trim() !== ""
      ? parseInt(birth_year, 10)
      : null;

  // Debug: log incoming multipart body and file
  console.log("DEBUG updateActor - req.body:", req.body);
  console.log("DEBUG updateActor - req.file:", req.file);

  // Use uploaded file if present, otherwise use URL
  const imagePath = req.file ? `/profiles/${req.file.filename}` : image_url;

  try {
    await pool.query(
      "UPDATE actors SET name=$1, birth_year=$2, nationality=$3, image_url=$4 WHERE actor_id=$5",
      [name, birthYear, nationality, imagePath, id]
    );
    res.redirect(`/actors/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE an actor
exports.deleteActor = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM actors WHERE actor_id = $1", [id]);
    res.redirect("/actors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
