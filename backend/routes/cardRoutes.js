import express from "express";
import { allCards } from "../controller/cardController.js";

const router = express.Router();

// default "/" and mapped allCards
router.get("/", allCards);

export default router;
