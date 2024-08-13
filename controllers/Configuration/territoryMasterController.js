import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import TerritoryMasterModel from "../../models/Configuration/TerretoryMaster.js";
class TerritoryMasterController {
    
    // Create TerritoryMaster
    static createTerritoryMaster = catchAsyncError(async (req, res, next) => {
        const { label, description } = req.body;
        const newTerritoryMaster = await TerritoryMasterModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Territory Master created successfully',
            data: newTerritoryMaster,
        });
    });

    // Get all TerritoryMasters
    static getAllTerritoryMasters = catchAsyncError(async (req, res, next) => {
        const territoryMasters = await TerritoryMasterModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Territory Masters retrieved successfully',
            data: territoryMasters,
        });
    });

    // Get TerritoryMaster by ID
    static getTerritoryMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const territoryMaster = await TerritoryMasterModel.findById(id);
        if (!territoryMaster) throw new ServerError("NotFound", "Territory Master");
        res.status(200).json({
            status: 'success',
            message: 'Territory Master retrieved successfully',
            data: territoryMaster,
        });
    });

    // Update TerritoryMaster
    static updateTerritoryMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label, description } = req.body;
        const territoryMaster = await TerritoryMasterModel.findById(id);
    
        if (!territoryMaster) throw new ServerError("NotFound", "Territory Master");
    
        territoryMaster.label = label;
        territoryMaster.description = description;
        const updatedTerritoryMaster = await territoryMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Territory Master updated successfully',
            data: updatedTerritoryMaster,
        });
    });

    // Delete TerritoryMaster
    static deleteTerritoryMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const territoryMaster = await TerritoryMasterModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Territory Master deleted successfully',
            data: territoryMaster
        });
    });
}

export default TerritoryMasterController;
