import mongoose from "mongoose";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import { updateTotalRevenueAndSales, validateOpportunityId } from "../../utils/opportunity.utils.js";
import RevenueMasterController from "./revenueController.js";
import RevenueController from "./revenueController.js";
import { opportunityFieldMap } from "../upload/fieldMap.js";
import { checkForLifetimeValueAndUpdate } from "../../utils/client.utils.js";
class OpportunityController {
  static createOpportunity = catchAsyncError(async (req, res, next, session) => {
    let {
      entryDate,
      enteredBy = req.user._id,
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
    console.log("revenue from frontend :  ", revenue)
    if ( !projectName || !stageClarification) {
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
    let newOpportunity = new OpportunityMasterModel({
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
      confidenceLevel,
    });
    //generating customId for Opp.
    await validateOpportunityId(req.body, newOpportunity);
    //handling revenues
    if(revenue){
      await RevenueController.handleRevenue(revenue, newOpportunity, session);
    }
    await newOpportunity.save({session});
    console.log("opportunity after inserting revenue : ",newOpportunity);
    newOpportunity = await OpportunityMasterModel.findById(newOpportunity._id).populate('revenue').session(session);
    updateTotalRevenueAndSales(newOpportunity);
    console.log("opportunity after expected sales calculation ", newOpportunity)
    await newOpportunity.save({session});
    if(newOpportunity.client)await checkForLifetimeValueAndUpdate(newOpportunity.client, session);
    return res.status(201).json({
      status: "success",
      message: "Opportunity created successfully",
      data: newOpportunity,
    });
  }, true);

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
      // .populate("associatedTender")
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
    console.log("update request called---------")
    const { id } = req.params;
    let updateData = req.body;
    console.log("updated op dta", updateData)
    let opportunity = await OpportunityMasterModel.findById(id)
    if (!opportunity) throw new ServerError("NotFound", "Opportunity");

    // await validateOpportunityId(updateData, opportunity);

    Object.keys(updateData).forEach((key) => {
        if(key != 'revenue')
         opportunity[key] = updateData[key];
    });

    if(updateData.revenue){
       await RevenueController.handleRevenue(updateData.revenue, opportunity, session);
    }
    
    
    await opportunity.save({session});
    console.log("opportunity after save", opportunity)
    let updatedOpportunity =  await OpportunityMasterModel.findById(opportunity._id).populate('revenue').session(session)
    updateTotalRevenueAndSales(updatedOpportunity);
    console.log("opportunity after revenue", updatedOpportunity)
    console.log("before lifetime value ")
    console.log("after lifetime value ")
    await updatedOpportunity.save({session})
    if(updatedOpportunity.client)await checkForLifetimeValueAndUpdate(updatedOpportunity.client, session);

    console.log("opp after total revenue save", updatedOpportunity)


    res.status(200).json({
      status: "success",
      message: "Opportunity updated successfully",
      data: updatedOpportunity,
    });
  }, true);

  static deleteOpportunity = catchAsyncError(async (req, res, next, session) => {
    const { id } = req.params;

    const opportunity = await OpportunityMasterModel.findByIdAndDelete(id).session(session);
    if(opportunity.client)await checkForLifetimeValueAndUpdate(opportunity.client, session);
    res.status(200).json({
      status: "success",
      message: "Opportunity deleted successfully",
      data: opportunity,
    });
  },true);
}

export default OpportunityController;
