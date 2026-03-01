const { Pool } = require("pg");
require("dotenv").config();

/**
 * DATABASE CONNECTION CONFIGURATION
 * * On Render: It uses process.env.DATABASE_URL (The Connection String)
 * On Local: It uses the individual DB_USER, DB_HOST, etc. from your .env
 */

const isProduction = process.env.NODE_ENV === "production" || process.env.DATABASE_URL;

const pool = new Pool({
  // If DATABASE_URL exists (Render/Supabase), use it. 
  // Otherwise, use the local object.
  connectionString: process.env.DATABASE_URL,
  
  // Fallback for local development if DATABASE_URL is not set
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT,

  // SSL is REQUIRED for Supabase/Render connections
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Test the connection logic
pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ Database connection error:", err.stack);
  }
  console.log("✅ Database connected successfully!");
  release();
});

module.exports = pool;