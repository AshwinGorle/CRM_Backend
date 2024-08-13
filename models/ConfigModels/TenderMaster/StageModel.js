import mongoose from "mongoose";

const StageSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    }
})

const StageModel = new mongoose.model("Stage",StageSchema);
export default StageModel;