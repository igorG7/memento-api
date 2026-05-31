import { Router } from "express";

import { launchError } from "./shared/middlewares/globalError-middleware.js";

import photosRoutes from "./modules/photos/photos-routes.js";

const routes = Router();

routes.use("/photos", photosRoutes);

routes.use(launchError);

export default routes;
