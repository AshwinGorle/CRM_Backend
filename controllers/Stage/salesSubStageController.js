import SalesSubStageModel from "../../models/StageModels/SalesSubStage.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
class SalesSubStageController {
    // Create SalesSubStageMaster
    static createSalesSubStage = catchAsyncError(async (req, res, next) => {
        const { label, salesStage, description, level } = req.body;
        const newSalesSubStageMaster = await SalesSubStageModel.create({ label, salesStage, description, level });
        res.status(201).json({
            status: 'success',
            message: 'Sales Sub-Stage Master created successfully',
            data: newSalesSubStageMaster,
        });
    });

    // Get all SalesSubStageMasters
    static getAllSalesSubStage = catchAsyncError(async (req, res, next) => {
        const salesSubStageMasters = await SalesSubStageModel.find().populate('salesStage');
        res.status(200).json({
            status: 'success',
            message: 'All Sales Sub-Stage Masters retrieved successfully',
            data: salesSubStageMasters,
        });
    });

    // Get SalesSubStageMaster by ID
    static getSalesSubStageById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const salesSubStageMaster = await SalesSubStageModel.findById(id).populate('salesStage');
        if (!salesSubStageMaster) throw new ServerError("NotFound", "Sales Sub-Stage Master");
        res.status(200).json({
            status: 'success',
            message: 'Sales Sub-Stage Master retrieved successfully',
            data: salesSubStageMaster,
        });
    });

    // Update SalesSubStageMaster
    static updateSalesSubStage = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { name, salesStage, description } = req.body;
        const salesSubStageMaster = await SalesSubStageModel.findById(id);
    
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
    static deleteSalesSubStage = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const salesSubStageMaster = await SalesSubStageModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Sales Sub-Stage Master deleted successfully',
            data: salesSubStageMaster
        });
    });
}

// export default SalesSubStageMasterControllere
export default SalesSubStageController;