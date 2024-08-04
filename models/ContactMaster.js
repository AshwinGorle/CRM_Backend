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
  clientName: {
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
  },
  relationshipDegree: {
    type: {
      type: Object,
      enum: [
        { type: "0th degree", description: "passive relationship" },
        { type: "1st degree", description: "very close" },
        { type: "2nd degree", description: "known us" },
        { type: "3rd degree", description: "connected through someone" },
        { type: "Estranged", description: "" },
      ],
    },
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
