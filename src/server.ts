import App from "./app.ts";
import emitter from "./config/eventEmitter-config.ts";

const PORT = process.env.PORT || 3000;
const app = App.app;

emitter.on("Ready", () => {
  app.listen(PORT, () => {
    console.log("Server started");
    console.log(`Running in: http://localhost:${PORT}`);
  });
});
