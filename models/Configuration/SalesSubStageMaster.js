import mongoose from "mongoose";

const SalesSubStageMasterSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    salesStage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SalesStageMaster',
    },
    description : {
        type : String
    }
})

const SalesSubStageMasterModel = new mongoose.model("SalesSubStageMaster",SalesSubStageMasterSchema);
export default SalesSubStageMasterModel;