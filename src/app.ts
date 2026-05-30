import express, { type Application } from "express";
import cors from "cors";

import MongoDB from "./config/mongoDB-config.ts";
import helmet from "./config/helmet-config.ts";
import routes from "./routes.ts";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configs();
    this.middlewares();
    this.routes();
  }

  private routes() {
    this.app.use("/", routes);
  }

  private middlewares() {
    this.app.use(helmet);
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  private async configs() {
    await MongoDB.connect();
  }
}

export default new App();
