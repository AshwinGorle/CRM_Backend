import mongoose from "mongoose";

const SalesSubStageMasterSchema = new mongoose.Schema({
    salesStage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SalesStageMaster',
    },
    label : {
        type : String,
        require : true,
    },
    description : {
        type : String
    },
    message : {
        type : String
    }
})

const SalesSubStageMasterModel = new mongoose.model("SalesSubStageMaster",SalesSubStageMasterSchema);
export default SalesSubStageMasterModel;