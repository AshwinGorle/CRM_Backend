import mongoose from "mongoose";

const RelationshipDegreeSchema = new mongoose.Schema({
    type : {
        type : String,
        require : true
    }
    ,
    description : {
        type : String
    }
})

const RelationshipDegreeModel = new mongoose.model("RelationshipDegree",RelationshipDegreeSchema);
export default RelationshipDegreeModel;