import mongoose from "mongoose";

const SubIndustryMasterSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
})

const SubIndustryMasterModel = new mongoose.model("SubIndustryMaster",SubIndustryMasterSchema);
export default SubIndustryMasterModel;