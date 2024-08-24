import mongoose from "mongoose";
import { clientError } from "../../config/responseMessage.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import ContactMasterModel from "../../models/ContactMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import uploadAndGetAvatarUrl from "../../utils/uploadAndGetAvatarUrl.utils.js";

class ContactMasterController {
  static createContact = catchAsyncError(async (req, res, next) => {
    let {
      gender,
      entryDate,
      enteredBy = req.user._id,
      firstName,
      lastName,
      client,
      jobTitle,
      phone,
      mobilePhone,
      workEmail,
      personalEmail,
      archeType,
      relationshipDegree,
      city,
      memorableDetail,
      detailsConfirmation,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !gender ||
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
      archeType,
      relationshipDegree,
      city,
      memorableDetail,
      detailsConfirmation,
      notes,
    });
    if(req.file){
      newContact.avatar = await uploadAndGetAvatarUrl(req.file,"contact",newContact._id, "stream");
    }
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
    const {config} = req.query;
    if(config === 'true'){
      const contacts = await ContactMasterModel.find().select("firstName lastName");
      return res.send({status : "success", message : "Config contacts fetched successfully", data : { config : true ,  contacts }});
    }
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
      // .populate("client")
      .populate("archeType")
      .populate("relationshipDegree");

    if (!contact) throw new ServerError("NotFound", "Contact");

    res.status(200).json({
      status: "success",
      message: "Contact retrieved successfully",
      data: contact,
    });
  });

  static updateContact = catchAsyncError(async (req, res, next) => {
    console.log("update intered")
    const { id } = req.params;
    const updateData = req.body;
    const contact = await ContactMasterModel.findById(id);
    console.log("update data ", updateData)
    if (!contact) throw new ServerError("NotFound", "Contact");

    Object.keys(updateData).forEach((key) => {
      contact[key] = updateData[key];
    });

    if(req.file){
      contact.avatar = await uploadAndGetAvatarUrl(req.file,"contact",contact._id, "stream");
    }
    console.log("contact before save ", contact);
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
