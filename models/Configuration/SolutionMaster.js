import mongoose from "mongoose";

const SolutionMasterSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
})

const SolutionMasterModel = new mongoose.model("SolutionMaster",SolutionMasterSchema);
export default SolutionMasterModel;