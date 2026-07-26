import { Router } from "express"
import v1Route from "./v1/v1.route";
import v2Router from "./v2/v2.route";

const indexRouter: Router = Router();

indexRouter.use("/v1", v1Route);

indexRouter.use("/v2", v2Router);

export default indexRouter;