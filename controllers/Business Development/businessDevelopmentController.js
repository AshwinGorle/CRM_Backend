import mongoose from "mongoose";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import BusinessDevelopmentModel from "../../models/BusinessDevelopmentModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";

class BusinessDevelopmentController {
  static createBusinessDevelopment = catchAsyncError(async (req, res, next) => {
    const {
      client,
      entryDate,
      enteredBy,
      contact,
      connectionSource,
      potentialProject,
      solution,
      subSolution,
      industry,
      territory,
      salesChamp,
      potentialTopLine,
      potentialOffset,
      Notes,
    } = req.body;

    // Validate required fields
    if (!entryDate || !enteredBy) {
      return res
        .status(400)
        .json({ status: "failed", message: "Required fields must be filled" });
    }

    // Manual validation for entryDate
    const validEntryDate = new Date(entryDate);
    if (isNaN(validEntryDate.getTime())) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid entryDate" });
    }

    const newBusinessDevelopment = new BusinessDevelopmentModel({
      client,
      entryDate: validEntryDate,
      enteredBy,
      contact,
      connectionSource,
      potentialProject,
      solution,
      subSolution,
      industry,
      territory,
      salesChamp,
      potentialTopLine,
      potentialOffset,
      Notes,
    });

    await newBusinessDevelopment.save();

    res
      .status(201)
      .json({
        status: "success",
        message: "Business Development created successfully",
        data: newBusinessDevelopment,
      });
  });

  static getAllBusinessDevelopments = catchAsyncError(
    async (req, res, next) => {
      const limit = parseInt(req.query.limit) || 12;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;
      const totalCount = await BusinessDevelopmentModel.countDocuments();
      
      const businessDevelopments = await BusinessDevelopmentModel.find().skip(skip).limit(limit)
        .populate("client")
        .populate("enteredBy")
        .populate("contact")
        .populate("solution")
        .populate("subSolution")
        .populate("industry")
        .populate("territory")
        .populate("salesChamp");

      res.status(200).json({
        status: "success",
        message: "All Business Developments retrieved successfully",
        data: {page, limit, totalCount, businessDevelopments}
      });
    }
  );

  static getBusinessDevelopmentById = catchAsyncError(
    async (req, res, next) => {
      const { id } = req.params;
      const businessDevelopment = await BusinessDevelopmentModel.findById(id)
        // .populate("client")
        // .populate("enteredBy")
        // .populate("contact")
        .populate("solution")
        .populate("subSolution")
        .populate("industry")
        .populate("territory")
        // .populate("salesChamp");

      if (!businessDevelopment)
        throw new ServerError("NotFound", "Business Development");

      res.status(200).json({
        status: "success",
        message: "Business Development retrieved successfully",
        data: businessDevelopment,
      });
    }
  );

  static updateBusinessDevelopment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    const businessDevelopment = await BusinessDevelopmentModel.findById(id);
    if (!businessDevelopment)
      throw new ServerError("NotFound", "Business Development");

    Object.keys(updateData).forEach((key) => {
      businessDevelopment[key] = updateData[key];
    });

    const updatedBusinessDevelopment = await businessDevelopment.save();

    res.status(200).json({
      status: "success",
      message: "Business Development updated successfully",
      data: updatedBusinessDevelopment,
    });
  });

  static deleteBusinessDevelopment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const businessDevelopment =
      await BusinessDevelopmentModel.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Business Development deleted successfully",
      data: businessDevelopment,
    });
  });
}

export default BusinessDevelopmentController;
