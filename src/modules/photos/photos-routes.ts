import { Router } from "express";

import controller from "./photos-controller.ts";
import { uploadMiddleware } from "./middlewares/index.ts";
import { uploadRateLimit } from "../shared/middlewares/rateLimit.ts";

const routes = Router();

routes.post("/", uploadRateLimit, uploadMiddleware, controller.upload);
routes.get("/", controller.list);

export default routes;
