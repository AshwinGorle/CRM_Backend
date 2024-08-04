import mongoose from "mongoose";

const OpportunityMasterSchema = new mongoose.Schema({
  customId: {
    type: String,
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
  client: {
    type: String,
    required: true,
  },
  partneredWith: {
    type: String,
  },
  projectName: {
    type: String,
    required: true,
  },
  associatedTender: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "TenderMaster"
  },
  solution: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "SolutionMaster"
  },
  subSolution: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "SubSolutionMaster"
  },
  salesChamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "TeamMaster"
  },
  /////////////
  salesStage : {
    type: mongoose.Schema.Types.ObjectId,
    ref : "SalesStageMaster"
  },
  salesSubStage : {
    type: mongoose.Schema.Types.ObjectId,
    ref : "SalesSubStageMaster"
  },
  stageClarification : {
    type: String,
    required: true,
  },
  /////////////
  
  //salesTopline derived
  
  offsets : {
    type: Number,
    required: true,
  },

  revenue : [{
    type: mongoose.Schema.Types.ObjectId,
    ref : "RevenueMaster"
  }],
  
  //totalRevenue    derived

  confidenceLevel : {
    type : Number,
    enum: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },

  //Expected Sales derived


  gender: {
    type: String,
    enum: ["M", "F", "O"],
    required: true,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
    default:
      "https://th.bing.com/th/id/OIP.XA5z4qJxvb0XtfkwB0DLxAAAAA?rs=1&pid=ImgDetMain",
  },
});

const OpportunityMasterModel = new mongoose.model(
  "OpportunityMaster",
  OpportunityMasterSchema
);
export default OpportunityMasterModel;
