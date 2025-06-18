import request from "supertest";
import app from "../../src/app.js";
import { initializeDatabase, db } from "../../src/config/database.js";
import loadCSV from "../../src/utils/csvLoader.js";

beforeAll(async () => {
  await initializeDatabase();
  await loadCSV("movielist.csv");
});

afterAll(async () => {
  await db.close();
});

describe("GET /awards/intervals", () => {
  it("deve retornar os produtores com maior e menor intervalo entre vitórias", async () => {
    const response = await request(app).get("/awards/intervals");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("min");
    expect(response.body).toHaveProperty("max");

    for (const group of ["min", "max"]) {
      expect(Array.isArray(response.body[group])).toBe(true);
      for (const item of response.body[group]) {
        expect(item).toHaveProperty("producer");
        expect(item).toHaveProperty("interval");
        expect(item).toHaveProperty("previousWin");
        expect(item).toHaveProperty("followingWin");
      }
    }
  });
});
