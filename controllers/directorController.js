const pool = require("../db");

// Render all directors
exports.getAllDirectors = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM directors ORDER BY director_id"
    );
    res.render("directors/index", { directors: result.rows });
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
    res.render("directors/show", { director: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// CREATE a new director
exports.createDirector = async (req, res) => {
  const { name, birth_year, nationality } = req.body;
  try {
    await pool.query(
      "INSERT INTO directors (name, birth_year, nationality) VALUES ($1, $2, $3)",
      [name, birth_year, nationality]
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
  const { name, birth_year, nationality } = req.body;
  try {
    await pool.query(
      "UPDATE directors SET name=$1, birth_year=$2, nationality=$3 WHERE director_id=$4",
      [name, birth_year, nationality, id]
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
