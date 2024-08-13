import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SolutionMasterModel from "../../models/Configuration/SolutionMaster.js";

class SolutionMasterController {
    // Create SolutionMaster
    static createSolutionMaster = catchAsyncError(async (req, res, next) => {
        const { label, description } = req.body;
        const newSolutionMaster = await SolutionMasterModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Solution Master created successfully',
            data: newSolutionMaster,
        });
    });

    // Get all SolutionMasters
    static getAllSolutionMasters = catchAsyncError(async (req, res, next) => {
        const solutionMasters = await SolutionMasterModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Solution Masters retrieved successfully',
            data: solutionMasters,
        });
    });

    // Get SolutionMaster by ID
    static getSolutionMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const solutionMaster = await SolutionMasterModel.findById(id);
        if (!solutionMaster) throw new ServerError("NotFound", "Solution Master");
        res.status(200).json({
            status: 'success',
            message: 'Solution Master retrieved successfully',
            data: solutionMaster,
        });
    });

    // Update SolutionMaster
    static updateSolutionMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label, description } = req.body;
        const solutionMaster = await SolutionMasterModel.findById(id);
    
        if (!solutionMaster) throw new ServerError("NotFound", "Solution Master");
    
        solutionMaster.label = label;
        solutionMaster.description = description;
        const updatedSolutionMaster = await solutionMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Solution Master updated successfully',
            data: updatedSolutionMaster,
        });
    });

    // Delete SolutionMaster
    static deleteSolutionMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const solutionMaster = await SolutionMasterModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Solution Master deleted successfully',
            data: solutionMaster,
        });
    });
}

export default SolutionMasterController;
