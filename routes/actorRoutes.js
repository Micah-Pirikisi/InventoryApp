const express = require("express");
const router = express.Router();
const actorController = require("../controllers/actorController");
const { uploadProfile } = require("../app");

// Render new actor form
router.get("/new", (req, res) => {
  res.render("actors/new");
});

// Render edit actor form (load actor first)
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await require("../db").query(
      "SELECT * FROM actors WHERE actor_id = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Actor not found");
    res.render("actors/edit", { actor: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// CRUD routes
router.get("/", actorController.getAllActors);
router.get("/:id", actorController.getActorById);
router.post(
  "/",
  uploadProfile.single("image_file"),
  express.urlencoded({ extended: true }),
  actorController.createActor
);
router.put(
  "/:id",
  uploadProfile.single("image_file"),
  express.urlencoded({ extended: true }),
  actorController.updateActor
);
router.delete("/:id", actorController.deleteActor);

module.exports = router;
