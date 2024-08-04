import mongoose, { Mongoose } from "mongoose";

const ClientMasterSchema = new mongoose.Schema({
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
        ref : "TeamMaster"
    },
    Offering : {
        type : "String"
    },
    annualRevenue : {
        type : Number
    },
    itEmployeeStrength : {
        type : Number
    },
    totalEmployeeStrength : {
        type : Number
    },
    PursuedOpportunityValue :{
        // Yet to derive
    },
    industry : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "IndustryMaster"
    },
    subIndustry : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "SubIndustryMaster"
    },
    territory :{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "TerritoryMaster"
    },
    incorporationType : {
        type : String,
        required : true,
        enum : ["Independent", "Subsidiary", "Holding", "Government body", "Semi Government", "NGO", "Ministry", "Family Owned", "Employee Owned"]
    },
    listedCompany : {
        type : Boolean
    },
    marketCap : {
        type : String,
    },
    annualRevenue :{
        type : String,
        RegExp : '^\d+(\.\d+)?\s?([KkLlMmCc][Rr])?$'
    },
    classification : {
            type : String,
            required : true
            // enum : ["Platinum", "Gold", "Silver", "Copper", "Bronze", "Nickel"]
    },
    primaryRelationShip : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "TeamMaster"
    },
    secondaryRelationShip : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "TeamMaster"
    },
    relationShipStatus : {
           type : String,
           enum : ["Well entrenched", ""]
    },
    relatedContacts : {
        type : String
    },
    lifeTimeValue : {
        //yet to be calculated
    },
    priority : {
        type : String,
        enum : ["Very High", "High", "Medium", "Low"]
    }


     
    
})

const ClientMasterModel = new mongoose.model("ClientMaster",ClientMasterSchema);
export default ClientMasterModel;