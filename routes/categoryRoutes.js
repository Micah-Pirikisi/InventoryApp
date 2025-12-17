const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// CRUD routes
router.get("/", categoryController.getAllCategories);

// NEW form route must come before :id
router.get("/new", categoryController.newCategoryForm);

router.get("/:id", categoryController.getCategoryById);
router.get("/:id/edit", categoryController.editCategoryForm);

router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
