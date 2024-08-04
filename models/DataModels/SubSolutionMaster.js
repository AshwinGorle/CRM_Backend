import mongoose from "mongoose";

const SubSolutionMasterSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
})

const SubSolutionMasterModel = new mongoose.model("SubSolutionMaster",SubSolutionMasterSchema);
export default SubSolutionMasterModel;