const pool = require("../db");

// Render all categories
exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY category_id"
    );
    res.render("categories/index", { categories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Render single category
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE category_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Category not found");
    }
    res.render("categories/show", { category: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// CREATE a new category
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2)",
      [name, description]
    );
    res.redirect("/categories"); // redirect back to list after create
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// UPDATE a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await pool.query(
      "UPDATE categories SET name = $1, description = $2 WHERE category_id = $3",
      [name, description, id]
    );
    res.redirect(`/categories/${id}`); // redirect back to show page
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM categories WHERE category_id = $1", [id]);
    res.redirect("/categories"); // redirect back to list after delete
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
