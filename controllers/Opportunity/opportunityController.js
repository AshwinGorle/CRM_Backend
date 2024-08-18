import mongoose from "mongoose";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";

class OpportunityController {
  static generateCustomID = (clientName) => {
    const cleanedName = clientName.replace(/\s+/g, "").toUpperCase();
    const namePart = cleanedName.padEnd(6, "0").slice(0, 6);
    const alphanumericPart = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    const customID = `OP-${namePart}-${alphanumericPart}`;
    return customID;
  };

  static createOpportunity = catchAsyncError(async (req, res, next) => {
    let {
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
    if (!entryDate || !enteredBy || !projectName || !stageClarification) {
      return res.status(400).json({
        status: "failed",
        message: "All required fields must be filled",
      });
    }

    // Manual validation for entryDate
    entryDate = new Date(entryDate);
    if (isNaN(entryDate.getTime())) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid entryDate" });
    }

    // Create a new instance of the OpportunityMasterModel
    //Generating opportunity id
    let customId = null;
    if (client) {
      const fetchedClient = await ClientMasterModel.findById(client).select(
        "name"
      );
      const customOpportunityId = this.generateCustomID(fetchedClient.name);
      customId = customOpportunityId;
    }

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
    res.status(201).json({
      status: "success",
      message: "Opportunity created successfully",
      data: newOpportunity,
    });
  });

  static getAllOpportunities = catchAsyncError(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const { id } = req.params;
    const opportunities = await OpportunityMasterModel.find()
      .limit(limit)
      .skip(skip)
      .populate("enteredBy")
      .populate("associatedTender")
      .populate("solution")
      .populate("subSolution")
      .populate("salesChamp")
      .populate("salesStage")
      .populate("salesSubStage")
      .populate("revenue")
      .populate("client");

    const updatedOpportunities = opportunities.map((opportunity) => {
      const plainOpportunity = opportunity.toObject(); // Convert to plain object
      const totalRevenue = plainOpportunity.revenue.reduce(
        (accumulator, current) => {
          return (
            accumulator + current.Q1 + current.Q2 + current.Q3 + current.Q4
          );
        },
        0
      );
      const expectedSales =
        totalRevenue * (plainOpportunity.confidenceLevel / 100);
      return {
        ...plainOpportunity,
        totalRevenue,
        expectedSales,
      };
    });

    res.status(200).json({
      status: "success",
      message: "All Opportunities retrieved successfully",
      data: updatedOpportunities,
    });
  });

  static getOpportunityById = catchAsyncError(async (req, res, next) => {
    let opportunity = await OpportunityMasterModel.findById(id)
      .populate("enteredBy")
      .populate("associatedTender")
      .populate("solution")
      .populate("subSolution")
      .populate("salesChamp")
      .populate("salesStage")
      .populate("salesSubStage")
      .populate("revenue")
      .populate("client");

    if (!opportunity) throw new ServerError("NotFound", "Opportunity");

    //Total Revenue calculation
    const allTimeRevenue = opportunity.revenue.reduce(
      (accumulator, current) => {
        return accumulator + current.Q1 + current.Q2 + current.Q3 + current.Q4;
      },
      0
    );

    opportunity = {
      ...opportunity.toObject(),
      totalRevenue: allTimeRevenue,
      expectedSales: allTimeRevenue * (opportunity.confidenceLevel / 100),
    };
    res.status(200).json({
      status: "success",
      message: "Opportunity retrieved successfully",
      data: opportunity,
    });
  });

  static updateOpportunity = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let updateData = req.body;
    const opportunity = await OpportunityMasterModel.findById(id);

    if (!opportunity) throw new ServerError("NotFound", "Opportunity");

    if (updateData.client && !opportunity.customId) {
      const fetchedClient = await ClientMasterModel.findById(
        updateData.client
      ).select("name");
      const customOpportunityId = this.generateCustomID(fetchedClient.name);
      updateData = { ...updateData, customId: customOpportunityId };
    }

    Object.keys(updateData).forEach((key) => {
      opportunity[key] = updateData[key];
    });
    const updatedOpportunity = await opportunity.save();

    res.status(200).json({
      status: "success",
      message: "Opportunity updated successfully",
      data: updatedOpportunity,
    });
  });

  static deleteOpportunity = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const opportunity = await OpportunityMasterModel.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Opportunity deleted successfully",
      data: opportunity,
    });
  });
}

export default OpportunityController;
