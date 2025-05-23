import { Pool, QueryResult } from "pg";

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

export const setItem = async (
  shortCode: string,
  originalUrl: string,
): Promise<string | null> => {
  const client = getPostgresClient();
  try {
    // Check if the short code already exists
    const existingResult: QueryResult = await client.query(
      "SELECT * FROM shortened_urls WHERE short_code = $1",
      [shortCode],
    );
    if (existingResult.rows.length > 0) {
      console.log("Short code already exists, no new row inserted.");
      return null; // Short code already exists
    }
    const response = await client.query(
      `
        INSERT INTO shortened_urls 
            (short_code, original_url) 
          VALUES ($1, $2) 
          ON CONFLICT (short_code) DO NOTHING`,
      [shortCode, originalUrl],
    );
    if (response.rowCount === 0) {
      console.log("Short code already exists, no new row inserted.");
      return null; // Short code already exists
    } else {
      console.log("Row inserted successfully.");
      return shortCode; // Return the short code
    }
  } catch (err) {
    console.error("Error storing in PostgreSQL:", err);
    throw err;
  }
};

export const getItem = async (shortCode: string): Promise<string | null> => {
  const client = getPostgresClient();
  try {
    const result: QueryResult = await client.query(
      "SELECT original_url FROM shortened_urls WHERE short_code = $1",
      [shortCode],
    );
    return result.rows.length > 0 ? result.rows[0].original_url : null;
  } catch (err) {
    console.error("Error retrieving from PostgreSQL:", err);
    return null;
  }
};

export const getAllItems = async (): Promise<any[]> => {
  const client = getPostgresClient();
  try {
    const result: QueryResult = await client.query(
      "SELECT short_code, original_url FROM shortened_urls",
    );
    return result.rows;
  } catch (err) {
    console.error("Error retrieving all items from PostgreSQL:", err);
    return [];
  }
};

export const deleteItem = async (shortCode: string): Promise<void> => {
  const client = getPostgresClient();
  try {
    await client.query("DELETE FROM shortened_urls WHERE short_code = $1", [
      shortCode,
    ]);
  } catch (err) {
    console.error("Error deleting from PostgreSQL:", err);
  }
};

export const closePostgresConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
