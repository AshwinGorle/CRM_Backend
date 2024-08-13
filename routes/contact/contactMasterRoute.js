import { Router } from "express";
import ContactMasterController from "../../controllers/ContactMaster.js/contactMasterController.js";
import contactMasterConfigRouter from "./contactMasterConfigRoute.js";

const contactMasterRouter = Router();

contactMasterRouter.use('/config', contactMasterConfigRouter);


export default contactMasterRouter;