import { Router, type IRouter } from "express";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(dashboardRouter);

export default router;
