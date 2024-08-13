import { Router } from "express";
import registrationMasterConfigRouter from "./registrationMasterConfigRouter.js";

const registrationMasterRouter = Router();

registrationMasterRouter.use('/config', registrationMasterConfigRouter);

export default registrationMasterRouter;