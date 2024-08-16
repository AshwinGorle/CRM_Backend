import mongoose, { Mongoose } from "mongoose";

export const ClientMasterSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
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
    Offering : {
        type : "String"
    },
    territory :{
        type : mongoose.Schema.Types.ObjectId,
        // required : true,
        ref : "TerritoryMaster"
    },
    PursuedOpportunityValue :{
        // Yet to derive
    },
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
        type : Number
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
    primaryRelationShip : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Staff"
    },
    secondaryRelationShip : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Staff"
    },
    relatedContacts : {
        type : String
    },
    relationShipStatus : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "RelationshipStatus"
    },
    lifeTimeValue : {
        type : String,
        default : '0'
    },
    priority : {
        type : String,
        enum : ["Very High", "High", "Medium", "Low"]
    },
    detailsConfirmation : {
        type : Boolean,
        default : false
    },
    
},{timestamps : true});

const ClientMasterModel = new mongoose.model("ClientMaster",ClientMasterSchema);
export default ClientMasterModel;