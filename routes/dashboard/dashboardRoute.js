import { Router } from "express";
import pipeViewRouter from "./pipeviewRoute.js";

const dashboardRouter = Router();

dashboardRouter.use('/pipe-view', pipeViewRouter);


export default dashboardRouter;
