import { Router } from "express";
import SalesSubStageMasterController from '../../controllers/Configuration/salesSubStageMasterController.js'
const salesSubStageMasterRouter = Router();

 salesSubStageMasterRouter.get('/', SalesSubStageMasterController.getAllSalesSubStageMasters);
 salesSubStageMasterRouter.get('/:id', SalesSubStageMasterController.getSalesSubStageMasterById);
 salesSubStageMasterRouter.post('/', SalesSubStageMasterController.createSalesSubStageMaster);
 salesSubStageMasterRouter.put('/:id', SalesSubStageMasterController.updateSalesSubStageMaster);
 salesSubStageMasterRouter.delete('/:id', SalesSubStageMasterController.deleteSalesSubStageMaster);

export default salesSubStageMasterRouter;
