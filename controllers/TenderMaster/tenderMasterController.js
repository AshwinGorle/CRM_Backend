import TenderMasterModel from "../../models/TenderMasterModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";

class TenderMasterController {
    // Create a new TenderMaster entry
    static createTenderMaster = catchAsyncError(async (req, res, next) => {
        const {
            customId,
            rfpDate,
            entryDate,
            enteredBy,
            submissionDueDate,
            client,
            reference,
            rfpTitle,
            rfpSource,
            associatedOpportunity,
            bond,
            bondValue,
            bondIssueDate,
            bondExpiry,
            submissionMode,
            evaluationDate,
            officer,
            bidManager,
            stage,
            stageExplanation,
            submissionDate
        } = req.body;

        // Validate required fields
        if (!customId || !rfpDate || !entryDate || !enteredBy) {
            return res.status(400).json({ status: 'failed', message: 'All required fields must be filled' });
        }

        // Create a new instance of the TenderMasterModel
        const newTender = new TenderMasterModel({
            customId,
            rfpDate,
            entryDate,
            enteredBy,
            submissionDueDate,
            client,
            reference,
            rfpTitle,
            rfpSource,
            associatedOpportunity,
            bond,
            bondValue,
            bondIssueDate,
            bondExpiry,
            submissionMode,
            evaluationDate,
            officer,
            bidManager,
            stage,
            stageExplanation,
            submissionDate
        });

        // Save the instance
        await newTender.save();
        res.status(201).json({ status: 'success', message: "Tender created successfully", data: newTender });
    });

    // Get all TenderMaster entries
    static getAllTenderMasters = catchAsyncError(async (req, res, next) => {
        const tenderMasters = await TenderMasterModel.find()
            .populate("enteredBy")
            .populate("client")
            .populate("associatedOpportunity")
            .populate("officer")
            .populate("bidManager")
            .populate("stage");

        res.status(200).json({
            status: 'success',
            message: 'All Tenders retrieved successfully',
            data: tenderMasters,
        });
    });

    // Get a TenderMaster by ID
    static getTenderMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;

        const tenderMaster = await TenderMasterModel.findById(id)
            .populate("enteredBy")
            .populate("client")
            .populate("associatedOpportunity")
            .populate("officer")
            .populate("bidManager")
            .populate("stage");

        if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");

        res.status(200).json({
            status: 'success',
            message: 'Tender retrieved successfully',
            data: tenderMaster,
        });
    });

    // Update a TenderMaster by ID
    static updateTenderMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;

        const tenderMaster = await TenderMasterModel.findById(id);
        if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");

        Object.keys(updateData).forEach((key) => {
            tenderMaster[key] = updateData[key];
        });

        const updatedTenderMaster = await tenderMaster.save();

        res.status(200).json({
            status: 'success',
            message: 'Tender updated successfully',
            data: updatedTenderMaster,
        });
    });

    // Delete a TenderMaster by ID
    static deleteTenderMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;

        const tenderMaster = await TenderMasterModel.findByIdAndDelete(id);
        if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");

        res.status(200).json({
            status: 'success',
            message: 'Tender deleted successfully',
            data: tenderMaster,
        });
    });
}

export default TenderMasterController;
