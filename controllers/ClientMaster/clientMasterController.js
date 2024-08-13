import mongoose from "mongoose";
import { clientError } from "../../config/responseMessage.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import ClientMasterModel from  "../../models/ClientMasterModel.js"
import { getClient } from "../../utils/client.utils.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
class ClientMasterController {
    static createClient = catchAsyncError(async (req, res, next) => {
        console.log("Request Body:", req.body);
        let {
            name,
            entryDate,
            enteredBy,
            industry,
            subIndustry,
            Offering,
            territory,
            PursuedOpportunityValue,
            incorporationType,
            listedCompany,
            marketCap,
            annualRevenue,
            classification,
            totalEmployeeStrength,
            itEmployeeStrength,
            primaryRelationShip,
            secondaryRelationShip,
            relatedContacts,
            relationShipStatus,
            lifeTimeValue,
            priority,
            detailsConfirmation,
        } = req.body;
    
        // Validate required fields
        if (
            !name ||
            !entryDate ||
            !enteredBy ||
            !industry ||
            !subIndustry ||
            !territory ||
            !incorporationType
        ) {
            return res.status(400).json({ status: 'failed', message: 'All required fields must be filled' });
        }
    
        // Manual validation for entryDate
        entryDate = new Date(entryDate);
        if (isNaN(entryDate.getTime())) {
            return res.status(400).json({ status: 'failed', message: 'Invalid entryDate' });
        }
    
        console.log("entry date", entryDate);
    
        // Create a new instance of the ClientMasterModel
        const newClient = new ClientMasterModel({
            name,
            entryDate,
            enteredBy,
            industry,
            subIndustry,
            Offering,
            territory,
            PursuedOpportunityValue,
            incorporationType,
            listedCompany,
            marketCap,
            annualRevenue,
            classification,
            totalEmployeeStrength,
            itEmployeeStrength,
            primaryRelationShip,
            secondaryRelationShip,
            relatedContacts,
            relationShipStatus,
            lifeTimeValue,
            priority,
            detailsConfirmation,
        });
    
        // Save the instance
        await newClient.save();
        console.log("New client:", newClient);
    
        res.status(201).json({ status: 'success', message: "Client created successfully", data: newClient });
    });
    

  static getAllClient = catchAsyncError(async (req, res, next) => {
    const clientMasters = await ClientMasterModel.find()
        .populate("enteredBy")
        .populate("industry")
        .populate("subIndustry")
        .populate("territory")
        .populate("incorporationType")
        .populate("classification")
        .populate("primaryRelationShip")
        .populate("secondaryRelationShip")
        .populate("relationShipStatus");
    res.status(200).json({
        status: 'success',
        message: 'All Client Masters retrieved successfully',
        data: clientMasters,
    });
});

static getClientById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const client = await ClientMasterModel.findById(id)
        .populate("enteredBy")
        .populate("industry")
        .populate("subIndustry")
        .populate("territory")
        .populate("incorporationType")
        .populate("classification")
        .populate("primaryRelationShip")
        .populate("secondaryRelationShip")
        .populate("relationShipStatus");
    if (!client) throw new ServerError("NotFound", "Client");
    res.status(200).json({
        status: 'success',
        message: 'Client retrieved successfully',
        data: client,
    });
});

static updateClient = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    const client = await ClientMasterModel.findById(id);

    if (!client) throw new ServerError("NotFound", "Client");

    Object.keys(updateData).forEach((key) => {
        client[key] = updateData[key];
    });
    const updatedClientMaster = await client.save();

    res.status(200).json({
        status: 'success',
        message: 'Client updated successfully',
        data: updatedClientMaster,
    });
});

static deleteClient = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const client = await ClientMasterModel.findByIdAndDelete(id);

    res.status(200).json({
        status: 'success',
        message: 'Client deleted successfully',
        data: client
    });
});

}
export default ClientMasterController;
