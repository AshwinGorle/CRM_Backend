import mongoose from "mongoose";

const OpportunityMasterSchema = new mongoose.Schema({
  customId: {
    type: String,
    default : null
    // required: true,
  },
  entryDate: {
    type: Date,
    required: true,
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Staff",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'ClientMaster'
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
    ref : "Staff"
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
  
  //salesTopLine derived
  salesTopLine : {
     type : Number,
  },
  
  offsets : {
    type: Number,
  },

  revenue : [{
    type: mongoose.Schema.Types.ObjectId,
    ref : "RevenueMaster"
  }],
  
  //totalRevenue    derived
  totalRevenue : {
    type : Number,
    default : 0
  },

  confidenceLevel : {
    type: Number,
    min: 0,    // Minimum value of 0
    max: 100,  // Maximum value of 100
    default : 0
  },

  //Expected Sales derived
  expectedSales : {
    type : Number,
    default : 0
  }
  //confidence * totalRevenue

});

const OpportunityMasterModel = new mongoose.model(
  "OpportunityMaster",
  OpportunityMasterSchema
);
export default OpportunityMasterModel;
