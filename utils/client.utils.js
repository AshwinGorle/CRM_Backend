import ClientMasterModel from "../models/ClientMasterModel.js"
import ClassificationModel from "../models/ConfigModels/ClientMaster/ClassificationModel.js";
import ContactMasterModel from "../models/ContactMasterModel.js";
import { ServerError } from "./customErrorHandler.utils.js";

function formatArrayString(input) {
    // Remove spaces after '[' and before ']'
    let formatted = input.replace(/\[\s*/, '[').replace(/\s*\]/, ']');

    // Remove spaces around single quotes
    formatted = formatted.replace(/\s*'([^']*)'\s*/g, "'$1'");

    return formatted;
}

export const parseContacts = async (relatedContacts, client)=>{
    if(relatedContacts){
        // relatedContacts = formatArrayString(relatedContacts.toString());
        console.log("relatedcn----", relatedContacts[0])
        // relatedContacts = JSON.parse(relatedContacts)
    }else { return }
    if(Array.isArray(relatedContacts) && relatedContacts.length > 0){
        for (const contactId of relatedContacts){
            const contact = await ContactMasterModel.findById(contactId);
            if(!contact) throw new ServerError("NotFound","contact")
            if(contact && client.relatedContacts.filter((contact)=>contact.toString() == contactId.toString()).length === 0){
                contact.client = client._id
                await contact.save();
                client["relatedContacts"].push(contact._id)
            }

        }
    }
}

export const getClient = async(clientId)=>{
    const client = await ClientMasterModel.findById(clientId);
    if(!client) throw new ServerError('NotFound',"client");
    return client;
}

export const getClassification = async(cId)=>{
    const classification = await ClassificationModel.findById(cId);
    if(!classification) throw new ServerError('NotFound',"classification");
    return classification;
}


