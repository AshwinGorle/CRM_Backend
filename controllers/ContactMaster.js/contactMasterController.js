import mongoose from "mongoose";
import { clientError } from "../../config/responseMessage.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import ContactMasterModel from "../../models/ContactMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";

class ContactMasterController {
  static createContact = catchAsyncError(async (req, res, next) => {
    let {
      gender,
      entryDate,
      enteredBy,
      firstName,
      lastName,
      client,
      jobTitle,
      phone,
      mobilePhone,
      workEmail,
      personalEmail,
      archType,
      relationshipDegree,
      city,
      memorableDetail,
      detailsConfirmation,
      Notes,
    } = req.body;

    // Validate required fields
    if (
      !gender ||
      !entryDate ||
      !enteredBy ||
      !firstName ||
      !lastName ||
      !jobTitle ||
      !mobilePhone ||
      !city
    ) {
      return res
        .status(400)
        .json({
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

    // Create a new instance of the ContactMasterModel
    const newContact = new ContactMasterModel({
      gender,
      entryDate,
      enteredBy,
      firstName,
      lastName,
      client,
      jobTitle,
      phone,
      mobilePhone,
      workEmail,
      personalEmail,
      archType,
      relationshipDegree,
      city,
      memorableDetail,
      detailsConfirmation,
      Notes,
    });

    // Save the instance
    await newContact.save();
    res
      .status(201)
      .json({
        status: "success",
        message: "Contact created successfully",
        data: newContact,
      });
  });

  static getAllContacts = catchAsyncError(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const totalCount = await ContactMasterModel.countDocuments()
    const contacts = await ContactMasterModel.find()
      .limit(limit)
      .skip(skip)
      .populate("enteredBy")
      .populate("client")
      .populate("archeType")
      .populate("relationshipDegree");

    res.status(200).json({
      status: "success",
      message: "All Contacts retrieved successfully--",
      data: {page, limit, totalCount, contacts}
    });
  });

  static getContactById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const contact = await ContactMasterModel.findById(id)
      .populate("enteredBy")
      .populate("client")
      .populate("archType")
      .populate("relationshipDegree");

    if (!contact) throw new ServerError("NotFound", "Contact");

    res.status(200).json({
      status: "success",
      message: "Contact retrieved successfully",
      data: contact,
    });
  });

  static updateContact = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    const contact = await ContactMasterModel.findById(id);

    if (!contact) throw new ServerError("NotFound", "Contact");

    Object.keys(updateData).forEach((key) => {
      contact[key] = updateData[key];
    });
    const updatedContact = await contact.save();

    res.status(200).json({
      status: "success",
      message: "Contact updated successfully",
      data: updatedContact,
    });
  });

  static deleteContact = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const contact = await ContactMasterModel.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Contact deleted successfully",
      data: contact,
    });
  });
}

export default ContactMasterController;
