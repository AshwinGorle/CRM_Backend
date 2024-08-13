import mongoose from "mongoose";

const IndustryMasterSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    }
    ,
    description : {
        type : String
    }
})

const IndustryMasterModel = new mongoose.model("IndustryMaster",IndustryMasterSchema);
export default IndustryMasterModel;