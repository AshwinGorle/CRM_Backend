import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import StageModel from "../../models/ConfigModels/TenderMaster/StageModel.js";

class TenderMasterConfigController{
     //---------------------stage-----------------------------------
    static createStage = catchAsyncError(async (req, res, next) => {
        const { label } = req.body;
        const stage = await StageModel.create({ label });
        res.status(201).json({
            status: "success",
            message: "Stage created successfully",
            data: stage,
        });
    });

    static getStageById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const stage = await StageModel.findById(id);
        if (!stage) throw new ServerError("NotFound","stage");
        res.status(200).json({
            status: "success",
            data: stage,
        });
    });

    static getAllStages = catchAsyncError(async (req, res, next) => {
        const stages = await StageModel.find();
        res.status(200).json({
            status: "success",
            data: stages,
        });
    });

    static updateStage = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        const stage = await StageModel.findById(id);
        if (!stage) throw new ServerError("NotFound","stage");
        Object.keys(updateData).forEach((key) => {
            stage[key] = updateData[key];
        });
        const updatedStage = await stage.save();
        res.status(200).json({
            status: "success",
            message: "Stage updated successfully",
            data: updatedStage,
        });
    });

    static deleteStage = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const stage = await StageModel.findByIdAndDelete(id);
        if (!stage) throw new ServerError("NotFound","stage");
        res.status(200).json({
            status: "success",
            message: "Stage deleted successfully",
            data : stage
        });
    });
   

}

export default TenderMasterConfigController;