import { TopologyOpeningEvent } from "mongodb";
import mongoose, { Mongoose } from "mongoose";

export const ClientMasterSchema = new mongoose.Schema({
    avatar : {
        type : String,
        default : ""
    },
    name : {
        type : String,
        require : true
    },
    clientCode : {
        type : "String"
    },
    entryDate : {
        type : Date,
        required : true
    },
    enteredBy : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Staff"
    },
    industry : {
        type : mongoose.Schema.Types.ObjectId,
        // required : true,
        ref : "IndustryMaster"
    },
    subIndustry : {
        type : mongoose.Schema.Types.ObjectId,
        // required : true,
        ref : "SubIndustryMaster"
    },
    offering : {
        type : "String"
    },
    territory :{
        type : mongoose.Schema.Types.ObjectId,
        // required : true,
        ref : "TerritoryMaster"
    },
    // pursuedOpportunityValue :{
    //     // Yet to derive
    // },
    incorporationType : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "IncorporationType",
        // required : true,
        // enum : ["Independent", "Subsidiary", "Holding", "Government body", "Semi Government", "NGO", "Ministry", "Family Owned", "Employee Owned"]
    },
    listedCompany : {
        type : Boolean
    },
    marketCap : {
        type : String,
    },
    annualRevenue : {
        type : String
    },
    classification : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "Classification",
        // enum : ["Platinum", "Gold", "Silver", "Copper", "Bronze", "Nickel"]
    },
    totalEmployeeStrength : {
        type : Number
    },
    itEmployeeStrength : {
        type : Number
    },
    primaryRelationship : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Staff"
    },
    secondaryRelationship : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Staff"
    },
    relatedContacts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "ContactMaster"
        }
    ],
    relationshipStatus : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "RelationshipStatus"
    },
    lifeTimeValue : {
        type : String,
        default : "0"
    },
    priority : {
        type : String,
        enum : ["Very High", "High", "Medium", "Low"]
    },
    contacts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'ContactMaster'
        }
    ]
    // detailsConfirmation : {
    //     type : Boolean,
    //     default : false
    // },
    
},{timestamps : true});

const ClientMasterModel = new mongoose.model("ClientMaster",ClientMasterSchema);
export default ClientMasterModel;