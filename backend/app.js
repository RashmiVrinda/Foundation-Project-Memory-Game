import cors from "cors";
import express from "express";
import cardRouter from "./routes/cardRoutes.js";

const app = express();

// Enable CORS for all incoming requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// all cards-related routes (allCards,addCards etc..)
app.use("/cards/", cardRouter);

export default app;
