import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SalesStageMasterModel from "../../models/Configuration/SalesStageMaster.js";
class SalesStageMasterController {
    // Create SalesStageMaster
    static createSalesStageMaster = catchAsyncError(async (req, res, next) => {
        const { label, description } = req.body;
        const newSalesStageMaster = await SalesStageMasterModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Sales Stage Master created successfully',
            data: newSalesStageMaster,
        });
    });

    // Get all SalesStageMasters
    static getAllSalesStageMasters = catchAsyncError(async (req, res, next) => {
        const salesStageMasters = await SalesStageMasterModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Sales Stage Masters retrieved successfully',
            data: salesStageMasters,
        });
    });

    // Get SalesStageMaster by ID
    static getSalesStageMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const salesStageMaster = await SalesStageMasterModel.findById(id);
        if (!salesStageMaster) throw new ServerError("NotFound", "Sales Stage Master");
        res.status(200).json({
            status: 'success',
            message: 'Sales Stage Master retrieved successfully',
            data: salesStageMaster,
        });
    });

    // Update SalesStageMaster
    static updateSalesStageMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label, description } = req.body;
        const salesStageMaster = await SalesStageMasterModel.findById(id);
    
        if (!salesStageMaster) throw new ServerError("NotFound", "Sales Stage Master");
    
        salesStageMaster.label = label;
        salesStageMaster.description = description;
        const updatedSalesStageMaster = await salesStageMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Sales Stage Master updated successfully',
            data: updatedSalesStageMaster,
        });
    });

    // Delete SalesStageMaster
    static deleteSalesStageMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const salesStageMaster = await SalesStageMasterModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Sales Stage Master deleted successfully',
            data: salesStageMaster,
        });
    });
}

export default SalesStageMasterController;