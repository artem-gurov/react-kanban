import 'dotenv/config';

const env = process.env.NODE_ENV ?? "development";
const port = parseInt(process.env.PORT ?? "5000", 10);
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
const dbUser = process.env.DB_USER ?? "root";
const dbPassword = process.env.DB_PASSWORD ?? "";
const dbHost = process.env.DB_HOST ?? "localhost";
const dbPort = process.env.DB_PORT ?? "27017";
const dbName = process.env.DB_NAME ?? "kanban";
const dbUri = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

export const config = {
  nodeEnv: env,
  port,
  corsOrigin,
  dbUri,
  isDevelopment: env === "development",
  isProduction: env === "production",
};
