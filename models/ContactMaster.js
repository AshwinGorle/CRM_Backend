import mongoose from "mongoose";

const ContactMasterSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["M", "F", "O"],
    required: true,
  },
  entryDate: {
    type: Date,
    required: true,
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "TeamMaster",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientMaster",
  },
  jobTitle: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  mobilePhone: {
    type: Number,
    required: true,
  },
  workEmail: {
    type: String,
    require: true,
  },
  personalEmail: {
    type: String,
    require: true,
  },
  archType: {
    type: String,
    enum: [
      "Decision Maker",
      "Influencer",
      "Economic Buyer",
      "Technical Evaluator",
      "Specifier ",
      "Detractor",
      "Generic",
    ],
    default : "Generic"
  },
  relationshipDegree: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "RelationshipDegree"
  },
  city: {
    type: String,
    require: true,
  },
  memorableDetail: {
    type: String,
  },
  detailsConfirmation : {
    type : Boolean,
    default : false
  },
  Notes: {
    type: String,
  },
});

const ContactMasterModel = new mongoose.model(
  "ContactMaster",
  ContactMasterSchema
);
export default ContactMasterModel;
