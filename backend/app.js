import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cardRouter from "./routes/cardRoutes.js";

const app = express();

// Required to handle paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// This tells Express to serve files from the 'frontend' folder
// We use '../frontend' because your app.js is inside the 'backend' folder
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Serve the index.html file when the root URL is accessed
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.use("/cards/", cardRouter);

export default app;