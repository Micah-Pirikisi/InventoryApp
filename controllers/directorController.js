const pool = require("../db");

// Render all directors
exports.getAllDirectors = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM directors ORDER BY director_id"
    );
    res.render("directors/index", {
      title: "Directors",
      directors: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Render single director
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
    const director = result.rows[0];
    res.render("directors/show", {
      title: director.name,
      director,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// CREATE a new director
exports.createDirector = async (req, res) => {
  const { name, birth_year, nationality, image_url } = req.body;
  const birthYear =
    birth_year && birth_year.toString().trim() !== ""
      ? parseInt(birth_year, 10)
      : null;

  // Debug: log incoming multipart body and file
  console.log("DEBUG createDirector - req.body:", req.body);
  console.log("DEBUG createDirector - req.file:", req.file);

  // Use uploaded file if present, otherwise use URL
  const imagePath = req.file ? `/profiles/${req.file.filename}` : image_url;

  try {
    await pool.query(
      "INSERT INTO directors (name, birth_year, nationality, image_url) VALUES ($1, $2, $3, $4)",
      [name, birthYear, nationality, imagePath]
    );
    res.redirect("/directors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// UPDATE a director
exports.updateDirector = async (req, res) => {
  const { id } = req.params;
  const { name, birth_year, nationality, image_url } = req.body;
  const birthYear =
    birth_year && birth_year.toString().trim() !== ""
      ? parseInt(birth_year, 10)
      : null;

  // Debug: log incoming multipart body and file
  console.log("DEBUG updateDirector - req.body:", req.body);
  console.log("DEBUG updateDirector - req.file:", req.file);

  // Use uploaded file if present, otherwise use URL
  const imagePath = req.file ? `/profiles/${req.file.filename}` : image_url;

  try {
    await pool.query(
      "UPDATE directors SET name=$1, birth_year=$2, nationality=$3, image_url=$4 WHERE director_id=$5",
      [name, birthYear, nationality, imagePath, id]
    );
    res.redirect(`/directors/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE a director
exports.deleteDirector = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM directors WHERE director_id = $1", [id]);
    res.redirect("/directors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
