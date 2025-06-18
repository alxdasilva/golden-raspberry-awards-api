import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

export async function initializeDatabase() {
  db = await open({
    filename: ":memory:",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER,
      title TEXT,
      studios TEXT,
      producers TEXT,
      winner BOOLEAN
    );
  `);
}

export { db };
