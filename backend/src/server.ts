import express from "express";
import cors from "cors";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import { boardRoutes } from "./routes/index";
import { connectDB } from "./db";

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api", boardRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Error handling (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
    console.log(`CORS enabled for ${config.corsOrigin}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
