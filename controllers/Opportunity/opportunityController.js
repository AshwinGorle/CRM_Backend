import mongoose from "mongoose";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import { updateTotalRevenueAndSales, validateOpportunityId } from "../../utils/opportunity.utils.js";
class OpportunityController {
  static createOpportunity = catchAsyncError(async (req, res, next, session) => {
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
    const newOpportunity = new OpportunityMasterModel({
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
    //generating customId for Opp.
    await validateOpportunityId(req.body, newOpportunity);
    await newOpportunity.save({session});
    newOpportunity = await OpportunityMasterModel.findById(newOpportunity._id).populate('revenue');
    updateTotalRevenueAndSales(newOpportunity);
    await newOpportunity.save({session});
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
    const { config } = req.query;
    if (config === "true") {
      const opportunities = await OpportunityMasterModel.find().select(
        "customId"
      );
      return res.send({
        status: "success",
        message: "Config opportunities fetched successfully",
        data: { config: true, opportunities },
      });
    }

    const totalCount = await OpportunityMasterModel.countDocuments();
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

    // const updatedOpportunities = opportunities.map((opportunity) => {
    //   const plainOpportunity = opportunity.toObject(); // Convert to plain object
    //   const totalRevenue = plainOpportunity.revenue.reduce(
    //     (accumulator, current) => {
    //       return (
    //         accumulator + current.Q1 + current.Q2 + current.Q3 + current.Q4
    //       );
    //     },
    //     0
    //   );
    //   const expectedSales =
    //     totalRevenue * (plainOpportunity.confidenceLevel / 100);
    //   return {
    //     ...plainOpportunity,
    //     totalRevenue,
    //     expectedSales,
    //   };
    // });

    res.status(200).json({
      status: "success",
      message: "All Opportunities retrieved successfully",
      data: { page, limit, totalCount, opportunities: opportunities },
    });
  });

  static getOpportunityById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let opportunity = await OpportunityMasterModel.findById(id)
      // .populate("enteredBy")
      .populate("associatedTender")
      .populate("solution")
      .populate("subSolution")
      // .populate("salesChamp")
      .populate("salesStage")
      .populate("salesSubStage")
      .populate("revenue");
    // .populate("client");

    if (!opportunity) throw new ServerError("NotFound", "Opportunity");

    res.status(200).json({
      status: "success",
      message: "Opportunity retrieved successfully",
      data: opportunity,
    });
  });

  static updateOpportunity = catchAsyncError(async (req, res, next, session) => {
    const { id } = req.params;
    let updateData = req.body;
    const opportunity = await OpportunityMasterModel.findById(id)
    if (!opportunity) throw new ServerError("NotFound", "Opportunity");

    await validateOpportunityId(updateData, opportunity);

    Object.keys(updateData).forEach((key) => {
      if(!key == 'revenue')
      opportunity[key] = updateData[key];
    });

    const updatedOpportunity = await opportunity.save({session});
    updatedOpportunity =  await OpportunityMasterModel.findById(updatedOpportunity._id).populate('revenue')
    updateTotalRevenueAndSales(updatedOpportunity);
    await updatedOpportunity.save({session})

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
