import { Router } from "express";
import { getAwardIntervals } from "../controllers/awards.controller.js";

const router = Router();

router.get("/intervals", getAwardIntervals);

export default router;
