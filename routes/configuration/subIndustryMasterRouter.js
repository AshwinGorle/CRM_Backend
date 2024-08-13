import { Router } from "express";
import SubIndustryMasterController from "../../controllers/Configuration/subIndustryMasterController.js";
const subIndustryMasterRouter = Router();

subIndustryMasterRouter.get('/', SubIndustryMasterController.getAllSubIndustryMasters);
subIndustryMasterRouter.get('/:id', SubIndustryMasterController.getSubIndustryMasterById);
subIndustryMasterRouter.post('/', SubIndustryMasterController.createSubIndustryMaster);
subIndustryMasterRouter.put('/:id', SubIndustryMasterController.updateSubIndustryMaster);
subIndustryMasterRouter.delete('/:id', SubIndustryMasterController.deleteSubIndustryMaster);

export default subIndustryMasterRouter;
