import { Router } from "express";
import SolutionMasterController from "../../controllers/Configuration/solutionMasterController.js";
const solutionMasterRouter = Router();

solutionMasterRouter.get('/', SolutionMasterController.getAllSolutionMasters);
solutionMasterRouter.get('/:id', SolutionMasterController.getSolutionMasterById);
solutionMasterRouter.post('/', SolutionMasterController.createSolutionMaster);
solutionMasterRouter.put('/:id', SolutionMasterController.updateSolutionMaster);
solutionMasterRouter.delete('/:id', SolutionMasterController.deleteSolutionMaster);

export default solutionMasterRouter;
