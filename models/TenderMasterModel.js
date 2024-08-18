import { MongoGCPError } from "mongodb";
import mongoose from "mongoose";

const TenderMasterSchema = new mongoose.Schema({
    rfpDate: {
        type: Date,
        required: true,
    },
    customId: { //this is tenderid
        type: String,
        default : null,
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
    submissionDueDate: {
        type: Date,
    },
    submissionDueDate: {
        type: Date,
    },
    submissionDueTime: {
        type: Date,
    },
    opportunity : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "OpportunityMaster"
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "ClientMaster"
    },
    rfpTitle: {
        type: String,
    },
    reference: { // tender ref
        type: String,
    },
    rfpSource: {  // How did we recieve the RFP
        type: String,
    },
    associatedOpportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OpportunityMaster"
    },
    bond: {
        type: Boolean,
        default: false
    },
    bondValue: {
        type: String,
        enum : ['Y', 'N']
    },
    bondIssueDate: {
        type: Date
    },
    bondExpiry: {
        type: Date
    },
    submissionMode: {
        type: String,
        enum: ["Email", "Hard Copy", "Portal"],
    },
    evaluationDate: {
        type: Date
    },
    officer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
    },
    bidManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
    },
    tenderStage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stage",
        // enum: [
            //     "Tender Being Received",
            //     "Tender Sent To Technical Team",
            //     "Awaiting Confirmation of Participation",
            //     "Confirmed Participation - Confirmed to Client",
            //     "Tender Dropped",
            //     "Tender Submitted"
            // ],
        },
        stageExplanation: {
            type: String,
        },
        // time
        submissionDate: {
            type: Date,
        },

});

const TenderMasterModel = new mongoose.model(
    "TenderMaster",
    TenderMasterSchema
);
export default TenderMasterModel;
