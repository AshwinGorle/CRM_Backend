import SalesSubStageMasterModel from "../../models/Configuration/SalesSubStageMaster.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
class SalesSubStageMasterController {
    // Create SalesSubStageMaster
    static createSalesSubStageMaster = catchAsyncError(async (req, res, next) => {
        const { name, salesStage, description } = req.body;
        const newSalesSubStageMaster = await SalesSubStageMasterModel.create({ name, salesStage, description });
        res.status(201).json({
            status: 'success',
            message: 'Sales Sub-Stage Master created successfully',
            data: newSalesSubStageMaster,
        });
    });

    // Get all SalesSubStageMasters
    static getAllSalesSubStageMasters = catchAsyncError(async (req, res, next) => {
        const salesSubStageMasters = await SalesSubStageMasterModel.find().populate('salesStage');
        res.status(200).json({
            status: 'success',
            message: 'All Sales Sub-Stage Masters retrieved successfully',
            data: salesSubStageMasters,
        });
    });

    // Get SalesSubStageMaster by ID
    static getSalesSubStageMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const salesSubStageMaster = await SalesSubStageMasterModel.findById(id).populate('salesStage');
        if (!salesSubStageMaster) throw new ServerError("NotFound", "Sales Sub-Stage Master");
        res.status(200).json({
            status: 'success',
            message: 'Sales Sub-Stage Master retrieved successfully',
            data: salesSubStageMaster,
        });
    });

    // Update SalesSubStageMaster
    static updateSalesSubStageMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { name, salesStage, description } = req.body;
        const salesSubStageMaster = await SalesSubStageMasterModel.findById(id);
    
        if (!salesSubStageMaster) throw new ServerError("NotFound", "Sales Sub-Stage Master");
    
        salesSubStageMaster.name = name;
        salesSubStageMaster.salesStage = salesStage;
        salesSubStageMaster.description = description;
        const updatedSalesSubStageMaster = await salesSubStageMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Sales Sub-Stage Master updated successfully',
            data: updatedSalesSubStageMaster,
        });
    });

    // Delete SalesSubStageMaster
    static deleteSalesSubStageMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const salesSubStageMaster = await SalesSubStageMasterModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Sales Sub-Stage Master deleted successfully',
            data: salesSubStageMaster
        });
    });
}

export default SalesSubStageMasterController;