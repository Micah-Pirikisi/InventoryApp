const express = require("express");
const router = express.Router();
const directorController = require("../controllers/directorController");

// Render new director form
router.get("/new", (req, res) => {
  res.render("directors/new");
});

// Render edit director form (load director first)
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await require("../db").query(
      "SELECT * FROM directors WHERE director_id = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Director not found");
    res.render("directors/edit", { director: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// CRUD routes
router.get("/", directorController.getAllDirectors);
router.get("/:id", directorController.getDirectorById);
router.post("/", directorController.createDirector);
router.put("/:id", directorController.updateDirector);
router.delete("/:id", directorController.deleteDirector);

module.exports = router;
