import { Router } from "express";

import { launchError } from "./shared/middlewares/globalError-middleware.ts";

import photosRoutes from "./modules/photos/photos-routes.ts";

const routes = Router();

routes.use("/photos", photosRoutes);

routes.use(launchError);

export default routes;
