import { Router } from "express";
import tenderMasterConfigRouter from "./tenderMasterConfigRoute.js";
const tenderMasterRouter = Router();

tenderMasterRouter.use("/config", tenderMasterConfigRouter);


export default tenderMasterRouter;