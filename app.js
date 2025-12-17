const express = require("express");
const pool = require("./db");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data (important!)
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

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
app.get('/', (req, res) => {
  res.render('home'); 
});

// Start Server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
