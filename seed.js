const pool = require("./db");

async function seed() {
  try {
    // Clear existing data (order matters because of FKs)
    await pool.query("DELETE FROM film_actors");
    await pool.query("DELETE FROM film_directors");
    await pool.query("DELETE FROM films");
    await pool.query("DELETE FROM categories");
    await pool.query("DELETE FROM actors");
    await pool.query("DELETE FROM directors");

    // Categories
    const categories = await pool.query(
      "INSERT INTO categories (name) VALUES ('Drama'), ('Comedy'), ('Action'), ('Romance') RETURNING *"
    );

    // Films
    const films = await pool.query(
      `INSERT INTO films (title, release_year, duration_minutes, rating, category_id, description)
       VALUES 
       ('The Great Escape', 1963, 172, 'PG', $1, 'Classic war film'),
       ('Funny Business', 2020, 95, 'PG-13', $2, 'Lighthearted comedy'),
       ('Explosive Action', 2021, 110, 'R', $3, 'High-octane thriller')
       RETURNING *`,
      [
        categories.rows[0].category_id,
        categories.rows[1].category_id,
        categories.rows[2].category_id,
      ]
    );

    // Actors
    const actors = await pool.query(
      "INSERT INTO actors (name) VALUES ('John Doe'), ('Jane Smith'), ('Chris Evans') RETURNING *"
    );

    // Directors
    const directors = await pool.query(
      "INSERT INTO directors (name) VALUES ('Steven Spielberg'), ('Greta Gerwig') RETURNING *"
    );

    // Junctions — pair films with actors/directors correctly
    await pool.query(
      "INSERT INTO film_actors (film_id, actor_id) VALUES ($1, $2), ($3, $4)",
      [
        films.rows[0].film_id,
        actors.rows[0].actor_id, // Great Escape + John Doe
        films.rows[1].film_id,
        actors.rows[1].actor_id, // Funny Business + Jane Smith
      ]
    );

    await pool.query(
      "INSERT INTO film_directors (film_id, director_id) VALUES ($1, $2), ($3, $4)",
      [
        films.rows[0].film_id,
        directors.rows[0].director_id, // Great Escape + Spielberg
        films.rows[1].film_id,
        directors.rows[1].director_id, // Funny Business + Gerwig
      ]
    );

    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
