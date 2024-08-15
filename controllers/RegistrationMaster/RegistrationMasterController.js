import mongoose from "mongoose";
import RegistrationMasterModel from "../../models/RegistrationMasterModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";

class RegistrationMasterController {
    // Create a new RegistrationMaster entry
    static createRegistrationMaster = catchAsyncError(async (req, res, next) => {
        const {
            client,
            entryDate,
            enteredBy,
            registrationChamp,
            status,
            websiteDetails,
            otherDetails,
            registrationDate,
            expiryDate,
            primaryContact,
            submittedDocuments,
            notes
        } = req.body;

        // Validate required fields
        if (!client || !entryDate || !enteredBy || !registrationChamp || !status || !websiteDetails?.username || !websiteDetails?.password || !primaryContact) {
            return res.status(400).json({ status: 'failed', message: 'All required fields must be filled' });
        }

        // Create a new instance of the RegistrationMasterModel
        const newRegistration = new RegistrationMasterModel({
            client,
            entryDate,
            enteredBy,
            registrationChamp,
            status,
            websiteDetails,
            otherDetails,
            registrationDate,
            expiryDate,
            primaryContact,
            submittedDocuments,
            notes
        });

        // Save the instance
        await newRegistration.save();
        res.status(201).json({ status: 'success', message: "Registration created successfully", data: newRegistration });
    });

    // Get all RegistrationMaster entries
    static getAllRegistrationMasters = catchAsyncError(async (req, res, next) => {
        const registrationMasters = await RegistrationMasterModel.find()
            .populate("client")
            .populate("enteredBy")
            .populate("registrationChamp")
            .populate("primaryContact");

        res.status(200).json({
            status: 'success',
            message: 'All RegistrationMasters retrieved successfully',
            data: registrationMasters,
        });
    });

    // Get a RegistrationMaster by ID
    static getRegistrationMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;

        const registrationMaster = await RegistrationMasterModel.findById(id)
            .populate("client")
            .populate("enteredBy")
            .populate("registrationChamp")
            .populate("primaryContact");

        if (!registrationMaster) throw new ServerError("NotFound", "RegistrationMaster");

        res.status(200).json({
            status: 'success',
            message: 'RegistrationMaster retrieved successfully',
            data: registrationMaster,
        });
    });

    // Update a RegistrationMaster by ID
    static updateRegistrationMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;

        const registrationMaster = await RegistrationMasterModel.findById(id);
        if (!registrationMaster) throw new ServerError("NotFound", "RegistrationMaster");

        Object.keys(updateData).forEach((key) => {
            registrationMaster[key] = updateData[key];
        });

        const updatedRegistrationMaster = await registrationMaster.save();

        res.status(200).json({
            status: 'success',
            message: 'RegistrationMaster updated successfully',
            data: updatedRegistrationMaster,
        });
    });

    // Delete a RegistrationMaster by ID
    static deleteRegistrationMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;

        const registrationMaster = await RegistrationMasterModel.findByIdAndDelete(id);
        if (!registrationMaster) throw new ServerError("NotFound", "RegistrationMaster");

        res.status(200).json({
            status: 'success',
            message: 'RegistrationMaster deleted successfully',
            data: registrationMaster,
        });
    });
}

export default RegistrationMasterController;
