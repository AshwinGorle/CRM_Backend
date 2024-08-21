import ClientMasterModel from "../models/ClientMasterModel.js";
import { ServerError } from "./customErrorHandler.utils.js";


export const updateTotalRevenueAndSales = (opportunity)=>{
    if(!opportunity) throw new ServerError("NotFound", "Opportunity inside updateRandS");
    const allTimeRevenue = opportunity?.revenue?.reduce(
        (accumulator, current) => {
          return accumulator + current.Q1 + current.Q2 + current.Q3 + current.Q4;
        },
        0
      );
    const expectedSales =  allTimeRevenue * (opportunity.confidenceLevel / 100)
    opportunity.totalRevenue = allTimeRevenue;
    opportunity.expectedSales = expectedSales;
}

export const generateOpportunityID = (clientName) => {
  const cleanedName = clientName.replace(/\s+/g, "").toUpperCase();
  const namePart = cleanedName.padEnd(6, "0").slice(0, 6);
  const alphanumericPart = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();
  const customID = `OP-${namePart}-${alphanumericPart}`;
  return customID;
};

export const validateOpportunityId = async (data, opportunity) => {
  console.log("intered valid : ")
  const {client} = data; 
  if(client && opportunity.customId && opportunity.client == client) return
  if(client){
      const fetchedClient = await ClientMasterModel.findById(client).select(
          "name"
        );
      console.log("fetched client : ", fetchedClient);
    if(!client) throw new ServerError("NotFound", "client");
    const customOpportunityId = generateOpportunityID(fetchedClient.name);
    console.log("custom opportunity id : " , customOpportunityId)
    opportunity['customId'] = customOpportunityId;
    console.log("data inside validate :", data);
  }
};
