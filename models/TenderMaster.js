import mongoose from "mongoose";

const TenderMasterSchema = new mongoose.Schema({
    customId: {
        type: String,
        required: true,
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
        ref: "TeamMaster",
    },
    submissionDueDate: {
        type: Date,
    },
    submissionDate: {
        type: Date,
        required: true,
    },
    client: {
        type: String,
    },
    ref: {
        type: String,
    },
    rfpTitle: {
        type: String,
    },
    rfpSource: {
        type: String,
        required: true,
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
        required: true,
    },
    evaluationDate: {
        type: Date
    },
    officer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TeamMaster",
    },
    bidManager: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TeamMaster",
    },
    stage: {
        type: String,
        enum: [
            "Tender Being Received",
            "Tender Sent To Technical Team",
            "Awaiting Confirmation of Participation",
            "Confirmed Participation - Confirmed to Client",
            "Tender Dropped",
            "Tender Submitted"
        ],
        required: true
    },
    stageExplanation: {
        type: String,
        required: true
    }
    // time

});

const TenderMasterModel = new mongoose.model(
    "TenderMaster",
    TenderMasterSchema
);
export default TenderMasterModel;
