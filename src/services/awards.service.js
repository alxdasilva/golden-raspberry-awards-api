import { db } from "../config/database.js";

function getProducersList(producersField) {
  return producersField
    .split(/,| and /)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export async function calculateAwardIntervals() {
  const rows = await db.all(`
    SELECT year, producers
    FROM movies
    WHERE winner = 1
    ORDER BY year ASC
  `);

  const producerWins = new Map();

  rows.forEach(({ year, producers }) => {
    const producerList = getProducersList(producers);
    producerList.forEach((producer) => {
      if (!producerWins.has(producer)) {
        producerWins.set(producer, []);
      }
      producerWins.get(producer).push(year);
    });
  });

  const intervals = [];

  for (const [producer, years] of producerWins.entries()) {
    if (years.length < 2) continue;

    years.sort((a, b) => a - b);

    for (let i = 1; i < years.length; i++) {
      intervals.push({
        producer,
        interval: years[i] - years[i - 1],
        previousWin: years[i - 1],
        followingWin: years[i],
      });
    }
  }

  if (intervals.length === 0) return { min: [], max: [] };

  const minInterval = Math.min(...intervals.map((i) => i.interval));
  const maxInterval = Math.max(...intervals.map((i) => i.interval));

  return {
    min: intervals.filter((i) => i.interval === minInterval),
    max: intervals.filter((i) => i.interval === maxInterval),
  };
}
