import mongoose from "mongoose";

const TerritorySchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
})

const TerritoryModel = new mongoose.model("Territory",TerritorySchema);
export default TerritoryModel;