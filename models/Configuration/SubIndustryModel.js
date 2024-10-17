import mongoose from "mongoose";

const SubIndustrySchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
})

const SubIndustryModel = new mongoose.model("SubIndustry",SubIndustrySchema);
export default SubIndustryModel;