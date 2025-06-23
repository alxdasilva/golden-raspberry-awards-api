import fs from 'fs';
import csv from 'csv-parser';
import { getDb } from '../config/database.js';

export default function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const db = getDb();

    const insertStmt = `
      INSERT INTO movies (year, title, studios, producers, winner)
      VALUES (?, ?, ?, ?, ?);
    `;

    const movies = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const isWinner = (row.winner || '').toLowerCase() === 'yes';
        movies.push([
          parseInt(row.year),
          row.title,
          row.studios,
          row.producers,
          isWinner
        ]);
      })
      .on('end', async () => {
        try {
          const insert = await db.prepare(insertStmt);
          for (const movie of movies) {
            await insert.run(movie);
          }
          await insert.finalize();
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}
