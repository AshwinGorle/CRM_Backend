import mongoose from "mongoose";

const ContactMasterSchema = new mongoose.Schema({
  avatar : {
   type : String,
   default : null
  },
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
    ref: "User",
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
  },
  mobilePhone: {
    type: Number,
    required: true,
  },
  workEmail: {
    type: String,
  },
  personalEmail: {
    type: String,
  },
  archeType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Archetype",
    // enum: [
    //   "Decision Maker",
    //   "Influencer",
    //   "Economic Buyer",
    //   "Technical Evaluator",
    //   "Specifier ",
    //   "Detractor",
    //   "Generic",
    // ],
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
  // detailsConfirmation : {
  //   type : Boolean,
  //   default : false
  // },
  notes : [
    {type : String}
  ]

});

const ContactMasterModel = new mongoose.model(
  "ContactMaster",
  ContactMasterSchema
);
export default ContactMasterModel;
