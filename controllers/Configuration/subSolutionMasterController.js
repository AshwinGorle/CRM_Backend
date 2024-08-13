import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SubSolutionMasterModel from "../../models/Configuration/SubSolutionMaster.js";

class SubSolutionMasterController {
    // Create SolutionMaster
    static createSubSolutionMaster = catchAsyncError(async (req, res, next) => {
        const { label, description } = req.body;
        const newSubSolutionMaster = await SubSolutionMasterModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Solution Master created successfully',
            data: newSubSolutionMaster,
        });
    });

    // Get all SolutionMasters
    static getAllSubSolutionMasters = catchAsyncError(async (req, res, next) => {
        const subSolutionMasters = await SubSolutionMasterModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Solution Masters retrieved successfully',
            data: subSolutionMasters,
        });
    });

    // Get SolutionMaster by ID
    static getSubSolutionMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const solutionMaster = await SubSolutionMasterModel.findById(id);
        if (!solutionMaster) throw new ServerError("NotFound", "Solution Master");
        res.status(200).json({
            status: 'success',
            message: 'Solution Master retrieved successfully',
            data: solutionMaster,
        });
    });

    // Update SolutionMaster
    static updateSubSolutionMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label, description } = req.body;
        const solutionMaster = await SubSolutionMasterModel.findById(id);
    
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
    static deleteSubSolutionMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const solutionMaster = await SubSolutionMasterModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: ' Sub Solution Master deleted successfully',
            data: solutionMaster,
        });
    });
}

export default SubSolutionMasterController;
