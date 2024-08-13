import { Router } from "express";
import IndustryMasterController from "../../controllers/Configuration/industryMasterController.js";
const industryMasterRouter = Router();

industryMasterRouter.get('/', IndustryMasterController.getAllIndustryMasters);
industryMasterRouter.get('/:id', IndustryMasterController.getIndustryMasterById);
industryMasterRouter.post('/', IndustryMasterController.createIndustryMaster);
industryMasterRouter.put('/:id', IndustryMasterController.updateIndustryMaster);
industryMasterRouter.delete('/:id', IndustryMasterController.deleteIndustryMaster);

export default industryMasterRouter;

