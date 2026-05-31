import { Router } from "express";

import controller from "./photos-controller.js";
import { uploadMiddleware } from "./middlewares/index.js";
import { uploadRateLimit } from "../shared/middlewares/rateLimit.js";

const routes = Router();

routes.post("/", uploadRateLimit, uploadMiddleware, controller.upload);
routes.get("/", controller.list);

export default routes;
