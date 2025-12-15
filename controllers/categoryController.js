const pool = require("../db");

// GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY category_id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// GET one category by ID
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
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// CREATE a new category
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.json(result.rows[0]);
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
    const result = await pool.query(
      "UPDATE categories SET name = $1, description = $2 WHERE category_id = $3 RETURNING *",
      [name, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Category not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE category_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Category not found");
    }
    res.send(`Category ${id} deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
