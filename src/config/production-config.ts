import { configDotenv } from "dotenv";

configDotenv();

export const isProduction = process.env.NODE_ENV === "production";
