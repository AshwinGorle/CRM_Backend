import mongoose, { Mongoose } from "mongoose";

const BusinessDevelopmentMasterSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClientMaster"
    },
    entryDate: {
        type: Date,
        required: true
    },
    enteredBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TeamMaster"
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContactMaster"
    },
    connectionSource: {
        type: String
    },
    potentialProject: {
        type: String
    },
    solution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SolutionMaster"
    },
    subSolution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSolutionMaster"
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IndustryMaster"
    },
    territory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TerritoryMaster"
    },
    salesChamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TerritoryMaster"
    },
    potentialTopLine: {
        type: Number
    },
    potentialOffset: {
        type: Number
    },
    Notes: [{
        type: String
    }]


})

const BusinessDevelopmentMasterModel = new mongoose.model("BusinessDevelopmentMaster", BusinessDevelopmentMasterSchema);
export default BusinessDevelopmentMasterModel;