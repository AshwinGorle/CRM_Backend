import { Router } from "express";
import ClientMasterController from "../../controllers/ClientMaster/clientMasterController.js";
import clientMasterConfigRouter from "./clientMasterConfigRoute.js";
import upload from "../../utils/storage.utils.js";
const clientMasterRouter = Router();
clientMasterRouter.use('/config',clientMasterConfigRouter);
clientMasterRouter.get('/', ClientMasterController.getAllClient);
clientMasterRouter.get('/:id', ClientMasterController.getClientById);
clientMasterRouter.post('/', upload.single('avatar') ,ClientMasterController.createClient);
clientMasterRouter.put('/:id', upload.single('avatar') ,ClientMasterController.updateClient);
clientMasterRouter.delete('/:id', ClientMasterController.deleteClient);

export default clientMasterRouter;