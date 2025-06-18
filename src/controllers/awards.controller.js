import { calculateAwardIntervals } from "../services/awards.service.js";

export async function getAwardIntervals(req, res) {
  try {
    const result = await calculateAwardIntervals();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar os dados." });
  }
}
