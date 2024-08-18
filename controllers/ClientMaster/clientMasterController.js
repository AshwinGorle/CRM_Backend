import mongoose from "mongoose";
import { clientError } from "../../config/responseMessage.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import ClientMasterModel from  "../../models/ClientMasterModel.js"
import { getClient } from "../../utils/client.utils.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js" 
import uploadAndGetAvatarUrl from "../../utils/uploadAndGetAvatarUrl.utils.js";
class ClientMasterController {
    static getClientId = ()=>{
        return Array.from({ length: 6 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    } 
    static getLifetimeValue = async (clientId)=>{
       console.log("entered")
       const opportunities = await OpportunityMasterModel.find({client : clientId}).populate("revenue salesSubStage" );
       console.log("opportunities ", opportunities);
       if(opportunities.length == 0 ) return "Oppor.. not Available!"
       const lifeTimeValue = opportunities.reduce((acc, opportunity)=>{
            console.log("Includes : ", opportunity?.salesSubStage?.label )
            if(opportunity?.salesSubStage?.label == "Won - 6"){
                return acc + opportunity?.revenue?.reduce(
                    (accumulator, current) => {
                      return accumulator + current.Q1 + current.Q2 + current.Q3 + current.Q4;
                    },
                    0
                  );
            }
            return acc + 0;
        }, 0);
        return lifeTimeValue;
    }

    static createClient = catchAsyncError(async (req, res, next) => {
        
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
            clientCode : this.getClientId(),
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
        if(req.file){
            const avatarUrl =  await uploadAndGetAvatarUrl(req);
            console.log("client avatar url ", avatarUrl);
            newClient[avatar] = avatarUrl;
        }
    
        // Save the instance
        await newClient.save();
        console.log("New client:", newClient);
    
        res.status(201).json({ status: 'success', message: "Client created successfully", data: newClient });
    });
    

  static getAllClient = catchAsyncError(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page-1)*limit;
    const clientMasters = await ClientMasterModel.find().skip(skip).limit(limit)
        .populate("enteredBy")
        .populate("industry")
        .populate("subIndustry")
        .populate("territory")
        .populate("incorporationType")
        .populate("classification")
        .populate("primaryRelationShip")
        .populate("secondaryRelationShip")
        .populate("relationShipStatus");
    
    for(const client of clientMasters ){
        client.lifeTimeValue = await this.getLifetimeValue(client._id);
    }

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
    client.lifeTimeValue = await this.getLifetimeValue(client._id);
    console.log("lifeTimeValue : ", client.lifeTimeValue);
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
