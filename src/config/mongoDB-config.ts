import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import emitter from "./eventEmitter-config.ts";

configDotenv();

class MongoDB {
  async connect() {
    mongoose
      .connect(process.env.CONNECTION as string)
      .then(() => {
        console.log("Database connected");
        emitter.emit("Ready");
      })
      .catch((error) => console.log("Could not connect to database.", error));
  }
}

export default new MongoDB();
