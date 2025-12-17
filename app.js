const express = require("express");
const pool = require("./db");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(ejsLayouts);
app.set("layout", "layout");

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, "public", "posters"),
  path.join(__dirname, "public", "profiles"),
];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for poster uploads
const posterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "posters"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.params.id || "new"}_${Date.now()}${ext}`;
    cb(null, name);
  },
});

// Configure multer for profile uploads
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "profiles"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.params.id || "new"}_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const uploadPoster = multer({
  storage: posterStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Export multer instances early to avoid circular dependency
module.exports = { app, uploadPoster, uploadProfile };

// Middleware to parse form data (important!)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Import route files
const categoryRoutes = require("./routes/categoryRoutes");
const filmRoutes = require("./routes/filmRoutes");
const actorRoutes = require("./routes/actorRoutes");
const directorRoutes = require("./routes/directorRoutes");
const filmActorRoutes = require("./routes/filmActorRoutes");
const filmDirectorRoutes = require("./routes/filmDirectorRoutes");

// Use them with prefixes
app.use("/categories", categoryRoutes);
app.use("/films", filmRoutes);
app.use("/actors", actorRoutes);
app.use("/directors", directorRoutes);
app.use("/films", filmActorRoutes);
app.use("/films", filmDirectorRoutes);

// Render
app.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM films ORDER BY film_id DESC LIMIT 12"
    );
    res.locals.featuredFilms = result.rows;
    res.render("home", { title: "Home", featuredFilms: result.rows });
  } catch (err) {
    console.error(err);
    res.locals.featuredFilms = [];
    res.render("home", { title: "Home", featuredFilms: [] });
  }
});

const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


