const express = require("express");
const router = express.Router();
const filmDirectorController = require("../controllers/filmDirectorController");

router.post("/:id/directors", filmDirectorController.addDirectorToFilm);
router.delete(
  "/:id/directors/:directorId",
  filmDirectorController.removeDirectorFromFilm
);

module.exports = router;
