import mongoose from "mongoose";
const currencyRatesSchema = new mongoose.Schema({
    lastUpdate : {
        type : String,
    },
    conversionRates : {
        type : Object,
    }
},{timestamps : true})

const currencyRatesModel = new mongoose.model("Note", currencyRatesSchema);
export default currencyRatesModel;