import mongoose from "mongoose";

const IncorporationTypeSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    }
    
})

const IncorporationTypeModel = new mongoose.model("IncorporationType",IncorporationTypeSchema);
export default IncorporationTypeModel;