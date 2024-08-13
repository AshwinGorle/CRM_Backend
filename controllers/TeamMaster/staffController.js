import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import StaffModel from "../../models/StaffModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";

class StaffController{
    static getAllStaff = catchAsyncError(async(req, res, next)=>{
        const staff = await StaffModel.find();
        res.status(201).json({
            status: 'success',
            message: 'All staff fetched successfully',
            data: staff,
        });
    })
    
    static getStaff = catchAsyncError(async(req, res, next)=>{
        const id = req.params.id;
        const staff = await StaffModel.findById(id);
        if(!staff) throw new ServerError("NotFound", "Staff");
        res.status(201).json({
            status: 'success',
            message: ' staff fetched successfully',
            data: staff,
        });
    })

    static createStaff = catchAsyncError(async (req, res, next)=>{
        const { firstName ,  lastName } = req.body;
        const staff = await StaffModel.create({ firstName , lastName });
        res.status(201).json({
            status: 'success',
            message: 'Staff created successfully',
            data: staff,
        });
    })

    static updateStaff = catchAsyncError(async(req, res, next)=>{
        const id = req.params.id;
        const staff = await StaffModel.findByIdAndUpdate(id, req.body, {new: true});
        res.status(201).json({
            status: 'success',
            message: 'Staff updated successfully',
            data: staff,
        });
    })

    static deleteStaff = catchAsyncError(async(req, res, next)=>{
        const id = req.params.id;
        const staff = await StaffModel.findByIdAndDelete(id);
        res.status(201).json({
            status: 'success',
            message: 'Staff deleted successfully',
            data: staff,
        });
    })

}

export default StaffController;