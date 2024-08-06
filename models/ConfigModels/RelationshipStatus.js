import mongoose from "mongoose";

const RelationshipStatusSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    }
})

const RelationshipStatusModel = new mongoose.model("RelationshipStatus",RelationshipStatusSchema);
export default RelationshipStatusModel;