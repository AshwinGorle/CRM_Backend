import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SubIndustryMasterModel from "../../models/Configuration/SubIndustryMaster.js";

class SubIndustryMasterController {
    // Create SubIndustryMaster
    static createSubIndustryMaster = catchAsyncError(async (req, res, next) => {
        const { label, description } = req.body;
        const newSubIndustryMaster = await SubIndustryMasterModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Sub-Industry Master created successfully',
            data: newSubIndustryMaster,
        });
    });

    // Get all SubIndustryMasters
    static getAllSubIndustryMasters = catchAsyncError(async (req, res, next) => {
        const subIndustryMasters = await SubIndustryMasterModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Sub-Industry Masters retrieved successfully',
            data: subIndustryMasters,
        });
    });

    // Get SubIndustryMaster by ID
    static getSubIndustryMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const subIndustryMaster = await SubIndustryMasterModel.findById(id);
        if (!subIndustryMaster) throw new ServerError("NotFound", "Sub-Industry Master");
        res.status(200).json({
            status: 'success',
            message: 'Sub-Industry Master retrieved successfully',
            data: subIndustryMaster,
        });
    });

    // Update SubIndustryMaster
    static updateSubIndustryMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { name, description } = req.body;
        const subIndustryMaster = await SubIndustryMasterModel.findById(id);
    
        if (!subIndustryMaster) throw new ServerError("NotFound", "Sub-Industry Master");
    
        subIndustryMaster.name = name;
        subIndustryMaster.description = description;
        const updatedSubIndustryMaster = await subIndustryMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Sub-Industry Master updated successfully',
            data: updatedSubIndustryMaster,
        });
    });

    // Delete SubIndustryMaster
    static deleteSubIndustryMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const subIndustryMaster = await SubIndustryMasterModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Sub-Industry Master deleted successfully',
            data: subIndustryMaster,
        });
    });
}

export default SubIndustryMasterController;
