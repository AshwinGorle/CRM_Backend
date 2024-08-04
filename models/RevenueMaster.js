import mongoose from "mongoose";

const RevenueMasterSchema = new mongoose.Schema({
    year : {
        type : Number,
        required : true
    },
    Q1 : {
        type : Number,
        required : true
    }, 
    Q2 : {
        type : Number,
        required : true
    }, 
    Q3 : {
        type : Number,
        required : true
    }, 
    Q4 : {
        type : Number,
        required : true
    }, 
})

const RevenueMasterModel = new mongoose.model("RevenueMaster",RevenueMasterSchema);
export default RevenueMasterModel;