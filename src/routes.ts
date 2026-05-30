import { Router } from "express";

import { launchError } from "./shared/middlewares/globalError-middleware.ts";

const routes = Router();

routes.use(launchError);

export default routes;
