import { Router } from "express";
// import SalesStageMasterController from "../../controllers/Configuration/salesStageMasterController.js";
import SalesStageMasterController from "../../controllers/Configuration/salesStageMasterController.js";
const salesStageMasterRouter = Router();

salesStageMasterRouter.get('/', SalesStageMasterController.getAllSalesStageMasters);
salesStageMasterRouter.get('/:id', SalesStageMasterController.getSalesStageMasterById);
salesStageMasterRouter.post('/', SalesStageMasterController.createSalesStageMaster);
salesStageMasterRouter.put('/:id', SalesStageMasterController.updateSalesStageMaster);
salesStageMasterRouter.delete('/:id', SalesStageMasterController.deleteSalesStageMaster);

export default salesStageMasterRouter;
