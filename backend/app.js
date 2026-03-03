import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cardRouter from "./routes/cardRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 1. Serve static files from the frontend folder
// We go up one level (..) because app.js is inside the 'backend' folder
app.use(express.static(path.join(__dirname, "..", "frontend")));

// 2. The API route for cards
app.use("/cards", cardRouter);

// 3. Serve the index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

export default app;