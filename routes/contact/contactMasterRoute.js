import { Router } from "express";
import ContactMasterController from "../../controllers/ContactMaster.js/contactMasterController.js";
import contactMasterConfigRouter from "./contactMasterConfigRoute.js";
import validateContact from "../../middlewares/validateContact.js";

const contactMasterRouter = Router();

contactMasterRouter.use('/config', contactMasterConfigRouter);
contactMasterRouter.get('/', ContactMasterController.getAllContacts);
contactMasterRouter.get('/:id', ContactMasterController.getContactById);
contactMasterRouter.post('/', ContactMasterController.createContact);
contactMasterRouter.put('/:id', ContactMasterController.updateContact);
contactMasterRouter.delete('/:id', ContactMasterController.deleteContact);

export default contactMasterRouter;