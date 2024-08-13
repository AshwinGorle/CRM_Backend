import { Router } from "express";
import SubSolutionMasterController from "../../controllers/Configuration/subSolutionMasterController.js";
const subSolutionMasterRouter = Router();

subSolutionMasterRouter.get('/', SubSolutionMasterController.getAllSubSolutionMasters);
subSolutionMasterRouter.get('/:id', SubSolutionMasterController.getSubSolutionMasterById);
subSolutionMasterRouter.post('/', SubSolutionMasterController.createSubSolutionMaster);
subSolutionMasterRouter.put('/:id', SubSolutionMasterController.updateSubSolutionMaster);
subSolutionMasterRouter.delete('/:id', SubSolutionMasterController.deleteSubSolutionMaster);

export default subSolutionMasterRouter;