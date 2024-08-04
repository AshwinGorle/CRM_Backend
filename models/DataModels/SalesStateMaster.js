import mongoose from "mongoose";

const SalesStageMasterSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
})

const SalesStageMasterModel = new mongoose.model("SalesStageMaster",SalesStageMasterSchema);
export default SalesStageMasterModel;