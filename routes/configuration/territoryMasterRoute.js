import { Router } from "express";
import TerritoryMasterController from "../../controllers/Configuration/territoryMasterController.js";
const territoryMasterRouter = Router();

territoryMasterRouter.get('/', TerritoryMasterController.getAllTerritoryMasters);
territoryMasterRouter.get('/:id', TerritoryMasterController.getTerritoryMasterById);
territoryMasterRouter.post('/', TerritoryMasterController.createTerritoryMaster);
territoryMasterRouter.put('/:id', TerritoryMasterController.updateTerritoryMaster);
territoryMasterRouter.delete('/:id', TerritoryMasterController.deleteTerritoryMaster);

export default territoryMasterRouter;
