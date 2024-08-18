import csv from "csvtojson";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import ClassificationModel from "../../models/ConfigModels/ClientMaster/ClassificationModel.js";
import IncorporationTypeModel from "../../models/ConfigModels/ClientMaster/IncorporationTypeModel.js";
import RelationshipStatusModel from "../../models/ConfigModels/ClientMaster/RelationshipStatusModel.js";
import IndustryMasterModel from "../../models/Configuration/IndustryMaster.js";
import SubIndustryMasterModel from "../../models/Configuration/SubIndustryMaster.js";
import TerritoryMasterModel from "../../models/Configuration/TerretoryMaster.js";
import StaffModel from "../../models/StaffModel.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import ContactMasterModel from "../../models/ContactMasterModel.js";
import ArchetypeModel from "../../models/ConfigModels/ContactMaster/ArchetypeModel.js";
import RelationshipDegreeModel from "../../models/ConfigModels/ContactMaster/RelationshipDegreeModel.js";
import { parse } from "json2csv";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import SolutionMasterModel from "../../models/Configuration/SolutionMaster.js";
import SubSolutionMasterModel from "../../models/Configuration/SubSolutionMaster.js";
import SalesStageMasterModel from "../../models/Configuration/SalesStageMaster.js";
import SalesSubStageMasterModel from "../../models/Configuration/SalesSubStageMaster.js";
// import { Readable } from 'stream'
class UploadController {
  static clientFieldMapping = {
    "Client Name": "name",
    "Client Code": "clientCode",
    "Entry Date": "entryDate",
    "Entered by": "enteredBy",
    Industry: "industry",
    "Sub Industry": "subIndustry",
    "What do they do": "Offering",
    Territory: "territory",
    "Pursued Opportunity Value": "PursuedOpportunityValue",
    "Incorporation Type": "incorporationType",
    "Listed Company": "listedCompany",
    "Market Cap": "marketCap",
    "Annual Revenue (QAR)": "annualRevenue",
    Classification: "classification",
    "Employee Strength": "totalEmployeeStrength",
    "IT Employee Strength": "itEmployeeStrength",
    "Primary Relationship Holder": "primaryRelationShip",
    "Secondary Relationship Holder (Pref Economic)": "secondaryRelationShip",
    "Relationship Status": "relationShipStatus",
    "Details are upto date": "detailsConfirmation",
    "Related Contacts": "relatedContacts",
    "Lifetime Value": "lifeTimeValue",
    Priority: "priority",
    Action: "Action",
  };
  static contactFieldMap = {
    Gender: "gender",
    "Entry Date": "entryDate",
    "Entered by": "enteredBy",
    "First Name": "firstName",
    "Last Date": "lastName",
    "Client Name (drop down from Client Master)": "client", //remove this field
    "Job Title": "jobTitle",
    Phone: "phone",
    "Work Email": "workEmail",
    "Mobile Phone": "mobilePhone",
    "Personal Email": "personalEmail",
    Archetype: "archeType",
    "Relationship in degree": "relationshipDegree",
    "City / Location": "city",
    "Something memorable about him / her": "memorableDetail",
    "Notes / Recent Interactions": "Notes",
  };

  static opportunityFieldMap = {
    "Opportunity #": "customId",
    "Entry Date": "entryDate",
    "Entered by": "enteredBy",
    "CLIENT NAME": "client",
    "PARTNERED WITH": "partneredWith",
    "PROJECT NAME": "projectName",
    "ASSOCIATED TENDER": "associatedTender",
    SOLUTION: "solution",
    SUBSOLUTION: "subSolution",
    "SALES CHAMP": "salesChamp",
    "SALES STAGE": "salesStage",
    field13: "salesSubStage",
    field14: "stageClarification",
    "SALES TOPLINE": "salesTopLine",
    OFFSETS: "offsets",
    "CONFIDENCE LEVELS": "confidenceLevel",
    // Add other mappings if needed
  };

  static getFormattedData = async (bulkData, resource) => {
    const classificationMap = await ClassificationModel.find({}).then(
      (classifications) => {
        return classifications.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    const incorporationTypeMap = await IncorporationTypeModel.find({}).then(
      (types) => {
        return types.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    const relationshipStatusMap = await RelationshipStatusModel.find({}).then(
      (statuses) => {
        return statuses.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    const industryMap = await IndustryMasterModel.find({}).then(
      (industries) => {
        return industries.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    const subIndustryMap = await SubIndustryMasterModel.find({}).then(
      (industries) => {
        return industries.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    const territoryMap = await TerritoryMasterModel.find({}).then(
      (territories) => {
        return territories.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    const staffMap = await StaffModel.find({}).then((staffs) => {
      return staffs.reduce((acc, item) => {
        acc[item.firstName + " " + item.lastName] = item._id;
        return acc;
      }, {});
    });
    console.log("staff Map ----", staffMap);

    const archTypeMap = await ArchetypeModel.find({}).then((archType) => {
      return archType.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    });

    const solutionMap = await SolutionMasterModel.find({}).then((solution) => {
      return solution.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    });

    // const subSolutionMap = await SubSolutionMasterModel.find({}).then((subSolution) => {
    //   return subSolution.reduce((acc, item) => {
    //     acc[item.label] = item._id;
    //     return acc;
    //   }, {});
    // });

    const salesStageMap = await SalesStageMasterModel.find({}).then((salesStage) => {
      return salesStage.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    });

    const salesSubStageMap = await SalesSubStageMasterModel.find({}).then((salesSubStage) => {
      return salesSubStage.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    });

  

    console.log("staff archtype map ----", archTypeMap);

    const relationshipDegreeMap = await RelationshipDegreeModel.find({}).then(
      (RSDegree) => {
        return RSDegree.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    console.log("staff relationship degree map ----", relationshipDegreeMap);

    let csvToModelMap = null;

    switch (resource) {
      case "client":
        csvToModelMap = this.clientFieldMapping;
        break;
      case "contact":
        csvToModelMap = this.contactFieldMap;
        break;
      case "opportunity":
        csvToModelMap = this.opportunityFieldMap;
        break;
    }

    console.log("csv to model fields---", csvToModelMap);

    let analysisResult = {};
    const formattedData = bulkData.map((row, rowIdx) => {
      let formattedRow = {};
      Object.keys(row).forEach((csvField, colIdx) => {
        const modelField = csvToModelMap[csvField];
        console.log("ModelFeild------------ ", modelField);
        if (modelField) {
          switch (modelField) {
            case "classification":
              formattedRow[modelField] = classificationMap[row[csvField]];
              break;
            case "enteredBy":
              formattedRow[modelField] = staffMap[row[csvField]];
              break;
            case "incorporationType":
              formattedRow[modelField] = incorporationTypeMap[row[csvField]];
              break;
            case "relationShipStatus":
              formattedRow[modelField] = relationshipStatusMap[row[csvField]];
              break;
            case "listedCompany":
              formattedRow[modelField] = row[csvField] === "Listed";
              break;
            case "entryDate":
              formattedRow[modelField] = new Date(row[csvField]);
              break;
            case "industry":
              formattedRow[modelField] = industryMap[row[csvField]];
              break;
            case "subIndustry":
              formattedRow[modelField] = subIndustryMap[row[csvField]];
              break;
            case "territory":
              formattedRow[modelField] = territoryMap[row[csvField]];
              break;
            case "primaryRelationShip":
              formattedRow[modelField] = staffMap[row[csvField]];
              break;
            case "secondaryRelationShip":
              formattedRow[modelField] = staffMap[row[csvField]];
              break;
            case "archeType":
              formattedRow[modelField] = archTypeMap[row[csvField]];
              break;
            case "relationshipDegree":
              formattedRow[modelField] = relationshipDegreeMap[row[csvField]];
              break;
            case "client":
              formattedRow[modelField] = null;
              break;
            case "associatedTender":
              formattedRow[modelField] = null; // Implement getTenderIdByName function
              break;
            case "customId":
              formattedRow[modelField] = null; // Implement getTenderIdByName function
              break;
            case "solution":
              formattedRow[modelField] = solutionMap[row[csvField]]; // Implement getSolutionIdByName function
              break;
            case "subSolution":
              formattedRow[modelField] = solutionMap[row[csvField]]; // Implement getSolutionIdByName function
              break;
            case "salesStage":
              formattedRow[modelField] = salesStageMap[row[csvField]]; // Implement getSolutionIdByName function
              break;
            case "salesSubStage":
              formattedRow[modelField] = salesSubStageMap[row[csvField]]; // Implement getSolutionIdByName function
              break;
            case "salesChamp":
              formattedRow[modelField] = staffMap[row[csvField]]; // Implement getSolutionIdByName function
              break;
            default:
              formattedRow[modelField] = row[csvField];
          }

          if (
            modelField !== undefined &&
            formattedRow[modelField] === undefined
          ) {
            if (!analysisResult[rowIdx]) {
              analysisResult[rowIdx] = [];
            }
            analysisResult[rowIdx] = [
              ...analysisResult[rowIdx],
              { [colIdx]: { field: csvField, value: row[csvField] } },
            ];
          }
        }
      });
      return formattedRow;
    });

    return { formattedData, analysisResult };
  };

  static getCorrectionFile = async (
    bulkData,
    resource,
    analysisResult,
    formattedData
  ) => {
    let csvToModelMap = null;
    switch (resource) {
      case "client":
        csvToModelMap = this.clientFieldMapping;
        break;
      case "contact":
        csvToModelMap = this.contactFieldMap;
        break;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Write headers
    const headers = Object.keys(csvToModelMap).map((field) => field);
    worksheet.addRow(headers);
    formattedData.forEach((row, rowIdx) => {
      worksheet.addRow(
        headers.map(
          (header) => row[csvToModelMap[header]] || bulkData[rowIdx][header]
        )
      );
    });

    // Apply highlights based on the analysisResult
    Object.keys(analysisResult).forEach((rowIdx) => {
      const cells = analysisResult[rowIdx];
      cells.forEach((cell) => {
        Object.keys(cell).forEach((colIdx) => {
          const cellAddress = worksheet.getCell(
            parseInt(rowIdx) + 2,
            parseInt(colIdx) + 1
          );
          cellAddress.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFC0C0" }, // Light red background
          };
        });
      });
    });

    // Write the workbook to a file
    const uniqueName = Array.from({ length: 4 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join("");
    const outputFilePath = `CorrectionFiles/${resource}_${uniqueName}.xlsx`;
    await workbook.xlsx.writeFile(outputFilePath);
    return outputFilePath;
  };

  static uploadClientInBulk = async (req, res) => {
    const csvFilePath = req.file.path;
    const bulkData = await csv().fromFile(csvFilePath);
    const { formattedData, analysisResult } = await this.getFormattedData(
      bulkData,
      "client"
    );
    console.log("analysis result ---", analysisResult);
    console.log("formatted data ---", formattedData);
    if (Object.keys(analysisResult).length === 0) {
      console.log("directory name----");
      const clients = await ClientMasterModel.insertMany(formattedData);
      console.log("all clients", clients);
      const ids = clients.map((client) => client._id.toString());
      const csv = parse(ids.map((id) => ({ id })));
      const tempUploadDir = path.join(process.cwd(), "tempUpload");
      // Ensure the directory exists (create if it doesn't)
      if (!fs.existsSync(tempUploadDir)) {
        fs.mkdirSync(tempUploadDir);
      }
      const filePath = path.join(tempUploadDir, "filename.csv");
      fs.writeFileSync(filePath, csv);
      const uniqueName = new Date().toLocaleString();
      const fileUrl = await uploadToCloudinary(
        filePath,
        "CRM/Client/BulkUploads",
        uniqueName,
        2
      );
      fs.unlinkSync(filePath);
      res.send({
        status: "success",
        message: "bulk import successful",
        data: { file: fileUrl, client: clients },
      });
    } else {
      const correctionFilePath = await this.getCorrectionFile(
        bulkData,
        "client",
        analysisResult,
        formattedData
      );
      console.log("correction file path", correctionFilePath);
      res.download(correctionFilePath, "highlighted_output.xlsx", (err) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ status: "error", message: "Failed to download file" });
        }
      });
    }
  };
  static uploadContactInBulk = async (req, res) => {
    const csvFilePath = req.file.path;
    const bulkData = await csv().fromFile(csvFilePath);
    const { formattedData, analysisResult } = await this.getFormattedData(
      bulkData,
      "contact"
    );
    console.log("analysis result ---", analysisResult);
    console.log("formatted data ---", formattedData);
    if (Object.keys(analysisResult).length === 0) {
      console.log("directory name----");
      const contacts = await ContactMasterModel.insertMany(formattedData);
      console.log("all contacts", contacts);
      const ids = contacts.map((contact) => contact._id.toString());
      const csv = parse(ids.map((id) => ({ id })));
      const tempUploadDir = path.join(process.cwd(), "tempUpload");
      // Ensure the directory exists (create if it doesn't)
      if (!fs.existsSync(tempUploadDir)) {
        fs.mkdirSync(tempUploadDir);
      }
      const filePath = path.join(tempUploadDir, "filename.csv");
      fs.writeFileSync(filePath, csv);
      const uniqueName = new Date().toLocaleString();
      const fileUrl = await uploadToCloudinary(
        filePath,
        "CRM/Contact/BulkUploads",
        uniqueName,
        2
      );
      fs.unlinkSync(filePath);
      res.send({
        status: "success",
        message: "bulk import successful",
        data: { file: fileUrl, contacts: contacts },
      });
    } else {
      const correctionFilePath = await this.getCorrectionFile(
        bulkData,
        "contact",
        analysisResult,
        formattedData
      );
      console.log("correction file path", correctionFilePath);
      res.download(correctionFilePath, "highlighted_output.xlsx", (err) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ status: "error", message: "Failed to download file" });
        }
      });
    }
  };

  static uploadOpportunityInBulk = async (req, res) => {
    const csvFilePath = req.file.path;
    const bulkData = await csv().fromFile(csvFilePath);
    console.log("opportunity bulk data ----", bulkData);
    const { formattedData, analysisResult } = await this.getFormattedData(
      bulkData,
      "opportunity"
    );
    console.log("analysis result ---", analysisResult);
    console.log("formatted data ---", formattedData);
    return
    if (Object.keys(analysisResult).length === 0) {
      console.log("directory name----");
      const opportunities = await OpportunityMasterModel.insertMany(
        formattedData
      );
      console.log("all contacts", contacts);
      const ids = contacts.map((opportunity) => opportunity._id.toString());
      const csv = parse(ids.map((id) => ({ id })));
      const tempUploadDir = path.join(process.cwd(), "tempUpload");
      // Ensure the directory exists (create if it doesn't)
      if (!fs.existsSync(tempUploadDir)) {
        fs.mkdirSync(tempUploadDir);
      }
      const filePath = path.join(tempUploadDir, "filename.csv");
      fs.writeFileSync(filePath, csv);
      const uniqueName = new Date().toLocaleString();
      const fileUrl = await uploadToCloudinary(
        filePath,
        "CRM/opportunity/BulkUploads",
        uniqueName,
        2
      );
      fs.unlinkSync(filePath);
      res.send({
        status: "success",
        message: "bulk import successful",
        data: { file: fileUrl, opportunities: opportunities },
      });
    } else {
      const correctionFilePath = await this.getCorrectionFile(
        bulkData,
        "contact",
        analysisResult,
        formattedData
      );
      console.log("correction file path", correctionFilePath);
      res.download(correctionFilePath, "highlighted_output.xlsx", (err) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ status: "error", message: "Failed to download file" });
        }
      });
    }
  };
}

export default UploadController;
