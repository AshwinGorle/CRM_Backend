import mongoose from "mongoose";

const TerritoryMasterSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
})

const TerritoryMasterModel = new mongoose.model("TerritoryMaster",TerritoryMasterSchema);
export default TerritoryMasterModel;