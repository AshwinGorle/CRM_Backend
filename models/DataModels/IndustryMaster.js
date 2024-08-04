import mongoose from "mongoose";

const IndustryMasterSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    }
    ,
    description : {
        type : String
    }
})

const IndustryMasterModel = new mongoose.model("IndustryMaster",IndustryMasterScjema);
export default IndustryMasterModel;