import helmet from "helmet";
import { configDotenv } from "dotenv";
import { isProduction } from "./production-config.ts";

configDotenv();

const helmetConfig = {
  hsts: isProduction,
  contentSecurityPolicy: isProduction,
};

export default helmet(helmetConfig);
