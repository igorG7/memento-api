import helmet from "helmet";
import { configDotenv } from "dotenv";
import { isProduction } from "./production-config.js";

configDotenv();

const helmetConfig = {
  hsts: isProduction,
  contentSecurityPolicy: isProduction,
};

export default helmet(helmetConfig);
