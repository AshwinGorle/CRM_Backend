import { Router } from "express";
import ClientMasterController from "../../controllers/ClientMaster/clientMasterController.js";
import clientMasterConfigRouter from "./clientMasterConfigRoute.js";
const clientMasterRouter = Router();
clientMasterRouter.use('/config',clientMasterConfigRouter);
clientMasterRouter.get('/', ClientMasterController.getAllClient);
clientMasterRouter.get('/:id', ClientMasterController.getClientById);
clientMasterRouter.post('/', ClientMasterController.createClient);
clientMasterRouter.put('/:id', ClientMasterController.updateClient);
clientMasterRouter.delete('/:id', ClientMasterController.deleteClient);

export default clientMasterRouter;