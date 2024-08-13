import { MongoGCPError } from "mongodb";
import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
    firstName : {
        type : String,
        require : true
    },
    lastName : {
        type : String,
        require : true
    },
    teams : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Team',
        default: []
    }]
})

const StaffModel = new mongoose.model("Staff", StaffSchema);
export default StaffModel;