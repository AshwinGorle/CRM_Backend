import { MongoGCPError } from "mongodb";
import mongoose from "mongoose";

const TenderMasterSchema = new mongoose.Schema({
    customId: {
        type: String,
        default : null,
    },
    opportunity : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "OpportunityMaster"
    },
    rfpDate: {
        type: Date,
        required: true,
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
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "ClientMaster"
    },
    reference: {
        type: String,
    },
    rfpTitle: {
        type: String,
    },
    rfpSource: {
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
        type: Number
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
    stage: {
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
