import mongoose from "mongoose";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import RevenueMasterModel from "../../models/RevenueMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";

class RevenueMasterController {
    static createRevenue = catchAsyncError(async (req, res, next) => {
        const {oId} = req.params;
        const opportunity = await OpportunityMasterModel.findById(oId);
        if(!opportunity) throw new ServerError('NotFound', "opportunity");
        const { year, Q1, Q2, Q3, Q4 } = req.body;
        let total = 0;
        if(Q1)total += Q1;
        if(Q2)total += Q2;
        if(Q3)total += Q3;
        if(Q4)total += Q4;
        // Validate required fields
        if (oId && !year && (Q1 === undefined || Q2 === undefined || Q3 === undefined || Q4 === undefined)) {
            return res.status(400).json({ status: 'failed', message: 'All required fields must be filled with opportunity id' });
        }
        // Create a new instance of the RevenueMasterModel
        const newRevenue = new RevenueMasterModel({
            year,
            total,
            Q1,
            Q2,
            Q3,
            Q4,
        });
        await newRevenue.save();
        opportunity.revenue.push(newRevenue._id);
        await opportunity.save();
        res.status(201).json({ status: 'success', message: "Revenue record created successfully", data: newRevenue });
    });

    static getAllRevenues = catchAsyncError(async (req, res, next) => {
        const revenues = await RevenueMasterModel.find();

        res.status(200).json({
            status: 'success',
            message: 'All Revenue records retrieved successfully',
            data: revenues,
        });
    });

    static getRevenueById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const revenue = await RevenueMasterModel.findById(id);

        if (!revenue) throw new ServerError("NotFound", "Revenue");

        res.status(200).json({
            status: 'success',
            message: 'Revenue record retrieved successfully',
            data: revenue,
        });
    });

    static updateRevenue = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        const revenue = await RevenueMasterModel.findById(id);

        if (!revenue) throw new ServerError("NotFound", "Revenue");

        Object.keys(updateData).forEach((key) => {
            revenue[key] = updateData[key];
        });
        const updatedRevenue = await revenue.save();
        updatedRevenue.total = updatedRevenue.Q1 + updatedRevenue.Q2 + updatedRevenue.Q3 + updatedRevenue.Q4 
        res.status(200).json({
            status: 'success',
            message: 'Revenue record updated successfully',
            data: updatedRevenue,
        });
    });

    static deleteRevenue = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;

        const revenue = await RevenueMasterModel.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'Revenue record deleted successfully',
            data: revenue,
        });
    });
}

export default RevenueMasterController;
