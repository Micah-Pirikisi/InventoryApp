const express = require("express");
const router = express.Router();
const filmActorController = require("../controllers/filmActorController");

router.post("/:id/actors", filmActorController.addActorToFilm);
router.delete("/:id/actors/:actorId", filmActorController.removeActorFromFilm);

module.exports = router;
