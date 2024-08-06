import mongoose, { Mongoose } from "mongoose";

const BusinessDevelopmentMasterSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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
        required: true,
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
        required: true,
        ref: "SolutionMaster"
    },
    subSolution: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SubSolutionMaster"
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "IndustryMaster"
    },
    territory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TerritoryMaster"
    },
    salesChamp: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TerritoryMaster"
    },
    potentialTopLine: {
        type: Number
    },
    potentialOffset: {
        type: Number
    },
    comments: {
        type: String
    }


})

const BusinessDevelopmentMasterModel = new mongoose.model("BusinessDevelopmentMaster", BusinessDevelopmentMasterSchema);
export default BusinessDevelopmentMasterModel;