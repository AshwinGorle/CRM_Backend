import mongoose from "mongoose";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";

class OpportunityController {
    static createOpportunity = catchAsyncError(async (req, res, next) => {
        let {
            customId,
            entryDate,
            enteredBy,
            client,
            partneredWith,
            projectName,
            associatedTender,
            solution,
            subSolution,
            salesChamp,
            salesStage,
            salesSubStage,
            stageClarification,
            salesTopLine,
            offsets,
            revenue,
            confidenceLevel,
        } = req.body;

        // Validate required fields
        if (!customId || !entryDate || !enteredBy || !projectName || !stageClarification) {
            return res.status(400).json({ status: 'failed', message: 'All required fields must be filled' });
        }

        // Manual validation for entryDate
        entryDate = new Date(entryDate);
        if (isNaN(entryDate.getTime())) {
            return res.status(400).json({ status: 'failed', message: 'Invalid entryDate' });
        }

        // Create a new instance of the OpportunityMasterModel
        const newOpportunity = new OpportunityMasterModel({
            customId,
            entryDate,
            enteredBy,
            client,
            partneredWith,
            projectName,
            associatedTender,
            solution,
            subSolution,
            salesChamp,
            salesStage,
            salesSubStage,
            stageClarification,
            salesTopLine,
            offsets,
            revenue,
            confidenceLevel,
        });

        // Save the instance
        await newOpportunity.save();
        res.status(201).json({ status: 'success', message: "Opportunity created successfully", data: newOpportunity });
    });

    static getAllOpportunities = catchAsyncError(async (req, res, next) => {
        const opportunities = await OpportunityMasterModel.find()
            .populate("enteredBy")
            .populate("associatedTender")
            .populate("solution")
            .populate("subSolution")
            .populate("salesChamp")
            .populate("salesStage")
            .populate("salesSubStage")
            .populate("revenue");

        res.status(200).json({
            status: 'success',
            message: 'All Opportunities retrieved successfully',
            data: opportunities,
        });
    });

    static getOpportunityById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const opportunity = await OpportunityMasterModel.findById(id)
            .populate("enteredBy")
            .populate("associatedTender")
            .populate("solution")
            .populate("subSolution")
            .populate("salesChamp")
            .populate("salesStage")
            .populate("salesSubStage")
            .populate("revenue");

        if (!opportunity) throw new ServerError("NotFound", "Opportunity");

        res.status(200).json({
            status: 'success',
            message: 'Opportunity retrieved successfully',
            data: opportunity,
        });
    });

    static updateOpportunity = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        const opportunity = await OpportunityMasterModel.findById(id);

        if (!opportunity) throw new ServerError("NotFound", "Opportunity");

        Object.keys(updateData).forEach((key) => {
            opportunity[key] = updateData[key];
        });
        const updatedOpportunity = await opportunity.save();

        res.status(200).json({
            status: 'success',
            message: 'Opportunity updated successfully',
            data: updatedOpportunity,
        });
    });

    static deleteOpportunity = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;

        const opportunity = await OpportunityMasterModel.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'Opportunity deleted successfully',
            data: opportunity
        });
    });
}

export default OpportunityController;
