import TenderMasterModel from "../../models/TenderMasterModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import {
  ClientError,
  ServerError,
} from "../../utils/customErrorHandler.utils.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import mongoose from "mongoose";
class TenderMasterController {
  // Create a new TenderMaster entry
  static generateTenderId = (territoryName, clientName, date) => {
    const territoryPart = territoryName
      .toUpperCase()
      .replace(/\s+/g, "")
      .slice(0, 4);
    const clientPart = clientName.toUpperCase().replace(/\s+/g, "").slice(0, 3);
    const monthAbbreviations = [
      "JA",
      "FE",
      "MR",
      "AP",
      "MA",
      "JN",
      "JL",
      "AU",
      "SE",
      "OC",
      "NO",
      "DE",
    ];
    const monthPart = monthAbbreviations[new Date(date).getMonth()];
    const numberPart = Math.floor(Math.random() * 90 + 10).toString();
    const customID = `TN-${territoryPart}-${clientPart}-${monthPart}-${numberPart}`;
    return customID;
  };

  static createTenderMaster = catchAsyncError(async (req, res, next) => {
    const {
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
      submissionDate,
    } = req.body;

    // Validate required fields
    if (!rfpDate || !entryDate || !enteredBy)
      throw new ClientError("AllRequired");

    // Create a new instance of the TenderMasterModel
    const newTender = new TenderMasterModel({
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
      submissionDate,
    });

    if (client) {
      const clientDetails = await ClientMasterModel.findById(client)
        .select("name territory")
        .populate("territory");
      const territory = clientDetails.territory.label;
      if (territory) {
        const tenderId = this.generateTenderId(
          territory,
          clientDetails.name,
          new Date()
        );
        console.log("Territory Id ", tenderId);
        newTender.customId = tenderId;
      }
    }

    // Save the instance
    await newTender.save();
    res.status(201).json({
      status: "success",
      message: "Tender created successfully",
      data: newTender,
    });
  });

  // Get all TenderMaster entries
  static getAllTenderMasters = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 12, config = false} = req.query;
    const  skip = (page - 1) * limit 
    const  totalCount = TenderMasterModel.countDocuments();
    if(Boolean(config)==true){
      const tenders = await TenderMasterModel.find().select("customId");
      return res.send({status : "success", message : "Config Tender fetched successfully", data : { config : true ,  tenders }});
    }
    tenderMasters = await TenderMasterModel.find()
      .limit(limit)
      .skip(skip)
      .populate("enteredBy")
      .populate("client")
      .populate("associatedOpportunity")
      .populate("officer")
      .populate("bidManager")
      .populate("tenderStage");

    res.status(200).json({
      status: "success",
      message: "All Tenders retrieved successfully",
      data: {page, limit, totalCount, tenders : tenderMasters}
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
      .populate("tenderStage");

    if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");

    res.status(200).json({
      status: "success",
      message: "Tender retrieved successfully",
      data: tenderMaster,
    });
  });

  // Update a TenderMaster by ID
  static updateTenderMaster = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let updateData = req.body;

    const tenderMaster = await TenderMasterModel.findById(id);
    if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");

    //checking tender id
    if (updateData.client && !tenderMaster.customId) {
      const clientDetails = await ClientMasterModel.findById(updateData.client)
        .select("name territory")
        .populate("territory");
      const territory = clientDetails.territory.label;
      if (territory) {
        const tenderId = this.generateTenderId(
          territory,
          clientDetails.name,
          new Date()
        );
        console.log("Territory Id ", tenderId);
        updateData = { ...updateData, customId: tenderId };
      }
    }

    Object.keys(updateData).forEach((key) => {
      tenderMaster[key] = updateData[key];
    });
    const updatedTenderMaster = await tenderMaster.save();

    res.status(200).json({
      status: "success",
      message: "Tender updated successfully",
      data: updatedTenderMaster,
    });
  });

  // Delete a TenderMaster by ID
  static deleteTenderMaster = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const tenderMaster = await TenderMasterModel.findByIdAndDelete(id);
    if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");

    res.status(200).json({
      status: "success",
      message: "Tender deleted successfully",
      data: tenderMaster,
    });
  });
}

export default TenderMasterController;
