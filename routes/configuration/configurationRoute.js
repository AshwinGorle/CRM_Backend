import { Router } from "express";
import industryMasterRouter from "./industryMasterRoute.js";
import salesStateMasterRouter from "./salesStageMasterRoute.js";
import salesSubStageMasterRouter from "./salesSubStageMasterRoute.js";
import solutionMasterRouter from "./solutionMasterRoute.js";
import subSolutionMasterRouter from "./subSolutionMasterRoute.js";
import subIndustryMasterRouter from "./subIndustryMasterRouter.js";
import territoryMasterRouter from "./territoryMasterRoute.js";
const configurationRoute = Router();

configurationRoute.use('/industry', industryMasterRouter);
configurationRoute.use('/sub-industry', subIndustryMasterRouter);
configurationRoute.use('/sales-stage', salesStateMasterRouter);
configurationRoute.use('/sales-sub-stage', salesSubStageMasterRouter);
configurationRoute.use('/solution', solutionMasterRouter);
configurationRoute.use('/sub-solution', subSolutionMasterRouter);
configurationRoute.use('/territory', territoryMasterRouter);

export default configurationRoute;

