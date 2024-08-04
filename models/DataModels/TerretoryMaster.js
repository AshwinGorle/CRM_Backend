import mongoose from "mongoose";

const TerritoryMasterSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
})

const TerritoryMasterModel = new mongoose.model("TerritoryMaster",TerritoryMasterSchema);
export default TerritoryMasterModel;