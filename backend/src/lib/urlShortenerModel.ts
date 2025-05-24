import { QueryResult } from "pg";
import { getPostgresClient } from "../connections/postgres";

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

export const deleteItem = async (shortCode: string): Promise<boolean> => {
  const client = getPostgresClient();
  let result = false;
  try {
    const response = await client.query(
      "DELETE FROM shortened_urls WHERE short_code = $1",
      [shortCode],
    );
    const numRowsDeleted = response?.rowCount;
    if (!numRowsDeleted) {
      console.log("No rows deleted, short code may not exist.");
    } else {
      console.log(
        `Deleted ${numRowsDeleted} row(s) with short code: ${shortCode}`,
      );
      result = true;
    }
  } catch (err) {
    console.error("Error deleting from PostgreSQL:", err);
  }
  return result;
};
