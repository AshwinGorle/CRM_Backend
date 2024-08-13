import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import IndustryMasterModel from "../../models/Configuration/IndustryMaster.js";

class IndustryMasterController {
    // Create IndustryMaster
    static createIndustryMaster = catchAsyncError(async (req, res, next) => {
        const { label , description } = req.body;
        const newIndustryMaster = await IndustryMasterModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Industry Master created successfully',
            data: newIndustryMaster,
        });
    });

    // Get all IndustryMasters
    static getAllIndustryMasters = catchAsyncError(async (req, res, next) => {
        const industryMasters = await IndustryMasterModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Industry Masters retrieved successfully',
            data: industryMasters,
        });
    });

    // Get IndustryMaster by ID
    static getIndustryMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const industryMaster = await IndustryMasterModel.findById(id);
        if (!industryMaster) throw new ServerError("NotFound", "Industry Master");
        res.status(200).json({
            status: 'success',
            message: 'Industry Master retrieved successfully',
            data: industryMaster,
        });
    });

    // Update IndustryMaster
    static updateIndustryMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { name, description } = req.body;
        const industryMaster = await IndustryMasterModel.findById(id);
    
        if (!industryMaster) throw new ServerError("NotFound", "Industry Master");
    
        industryMaster.name = name;
        industryMaster.description = description;
        const updatedIndustryMaster = await industryMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Industry Master updated successfully',
            data: updatedIndustryMaster,
        });
    });

    // Delete IndustryMaster
    static deleteIndustryMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const industryMaster = await IndustryMasterModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Industry Master deleted successfully',
            data: industryMaster
        });
    });
}

export default IndustryMasterController;
