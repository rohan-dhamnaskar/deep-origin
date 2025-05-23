import { Pool } from "pg";

let pool: Pool | null = null;

export const initPostgresClient = async (): Promise<Pool> => {
  try {
    pool = new Pool({
      user: process.env.POSTGRES_USER || "postgres",
      host: process.env.POSTGRES_HOST || "localhost",
      database: process.env.POSTGRES_DB || "urlshortener",
      password: process.env.POSTGRES_PASSWORD || "postgres",
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
    });

    // Test the connection
    const client = await pool.connect();
    client.release();

    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shortened_urls (
        short_code VARCHAR(10) PRIMARY KEY,
        original_url TEXT NOT NULL,
        user_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      -- Create a separate index for user_id column
      CREATE INDEX IF NOT EXISTS idx_shortened_urls_user_id ON shortened_urls(user_id);
    `);

    console.log("PostgreSQL connection established successfully");
    return pool;
  } catch (err) {
    console.error("Failed to establish PostgreSQL connection:", err);
    throw err;
  }
};

export const getPostgresClient = (): Pool => {
  if (!pool) {
    throw new Error("PostgreSQL client not initialized");
  }
  return pool;
};

export const closePostgresConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
