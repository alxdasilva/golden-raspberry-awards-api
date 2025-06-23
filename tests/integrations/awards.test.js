import request from "supertest";
import app from "../../src/app.js";
import { initializeDatabase, setDb } from "../../src/config/database.js";
import loadCSV from "../../src/utils/csvLoader.js";

describe("GET /awards/intervals com CSV original", () => {
  let db;

  beforeAll(async () => {
    db = await initializeDatabase();
    setDb(db);
    await loadCSV("movielist.csv");
  });

  afterAll(async () => {
    await db.close();
  });

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

  it("retorna os dados corretos do arquivo padrão", async () => {
    const expected = {
      min: [
        {
          producer: "Joel Silver",
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: "Matthew Vaughn",
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    };

    const response = await request(app).get("/awards/intervals");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expected);
  });
});
