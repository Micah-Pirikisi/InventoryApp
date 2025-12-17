const express = require("express");
const router = express.Router();
const filmController = require("../controllers/filmController");
const { uploadPoster } = require("../app");

router.get("/new", filmController.newFilmForm);
router.get("/", filmController.getAllFilms);
router.get("/:id", filmController.getFilmById);
router.get("/:id/edit", filmController.editFilmForm);
router.post(
  "/",
  uploadPoster.single("poster_file"),
  express.urlencoded({ extended: true }),
  filmController.createFilm
);
router.put(
  "/:id",
  uploadPoster.single("poster_file"),
  express.urlencoded({ extended: true }),
  filmController.updateFilm
);
router.delete("/:id", filmController.deleteFilm);

module.exports = router;
