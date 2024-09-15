import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import currencyRatesModel from "../../models/CurrencyRatesModel.js";

class CurrencyRateController {
  static  updateCurrencyRates = async (id) => {
    const res =  await fetch(process.env.CURRENCY_RATE_API, {
      method: "GET",
    })
    const data = await res.json();

    if(!id){
        const newCurrencyRates =  await currencyRatesModel.create({
            lastUpdate : data.time_last_update_utc,
            conversionRates : data.conversion_rates
        });
        console.log("new currency rates  : ", newCurrencyRates)
        return newCurrencyRates;
    }else{
        const updatedCurrencyRates  = await currencyRatesModel.findByIdAndUpdate(id, {
            lastUpdate : data.time_last_update_utc,
            conversionRates : conversion_rates
        })
        console.log("updated currency rates  : ", updatedCurrencyRates)
        return updatedCurrencyRates
      }   
  }

  static getCurrencyRates = catchAsyncError(async(req, res)=>{
    const currencyRates = await currencyRatesModel.find({});
    
    console.log(currencyRates);
    return res.send({status : "success", message : "Currency fetched successfully", data : currencyRates[0]});

    if(!currencyRates.length == 0){
        const currencyRates = await this.updateCurrencyRates();
        console.log("currency rates : ", currencyRates);
        return res.send({status : "success", message : "Currency fetched successfully", data : currencyRates});
    }else{
         console.log("wil not fetch")
    }
    
  })


}

export default CurrencyRateController;
