const pool = require("./db");

async function migrate() {
  try {
    console.log("Running migrations...");

    // Add poster_url to films table if it doesn't exist
    await pool.query(
      "ALTER TABLE films ADD COLUMN IF NOT EXISTS poster_url TEXT"
    );
    console.log("✓ Added poster_url column to films table");

    // Add image_url to actors table if it doesn't exist
    await pool.query(
      "ALTER TABLE actors ADD COLUMN IF NOT EXISTS image_url TEXT"
    );
    console.log("✓ Added image_url column to actors table");

    // Add image_url to directors table if it doesn't exist
    await pool.query(
      "ALTER TABLE directors ADD COLUMN IF NOT EXISTS image_url TEXT"
    );
    console.log("✓ Added image_url column to directors table");

    console.log("Migrations completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

migrate();
