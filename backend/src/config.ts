const env = process.env.NODE_ENV || "development";
const port = parseInt(process.env.PORT || "5000", 10);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/kanban";

export const config = {
  nodeEnv: env,
  port,
  corsOrigin,
  mongodbUri,
  isDevelopment: env === "development",
  isProduction: env === "production",
};
