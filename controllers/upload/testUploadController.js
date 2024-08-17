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
import { parse } from "json2csv";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
// import { Readable } from 'stream'
class TestUploadController {
  static fieldMapping = {
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

  static uploadData = async (req, res) => {
    const csvFilePath = req.file.path;
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

    const bulkData = await csv().fromFile(csvFilePath);
    let analysisResult = {};
    
    const formattedData = bulkData.map((row, rowIdx) => {
      let formattedRow = {};

      Object.keys(row).forEach((csvField, colIdx) => {
        const modelField = this.fieldMapping[csvField];
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
            default:
              formattedRow[modelField] = row[csvField];
          }

          if (formattedRow[modelField] === undefined) {
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
    // insertedIds;
    console.log("analysis result ---", analysisResult);
    console.log("formated data ---", formattedData);

    if (Object.keys(analysisResult).length === 0) {
      console.log("directory name----");
      const clients = await ClientMasterModel.insertMany(formattedData);
      console.log("all clients", clients);
      const ids = clients.map((client) => client._id.toString());
      const csv = parse(ids.map((id) => ({ id }))); // Convert array of IDs to CSV format
      // const filePath = path.join(__dirname, "clients_ids.csv");
      const tempUploadDir = path.join(process.cwd(), "tempUpload");

      // Ensure the directory exists (create if it doesn't)
      if (!fs.existsSync(tempUploadDir)) {
        fs.mkdirSync(tempUploadDir);
      }

      // Define the file path
      const filePath = path.join(tempUploadDir, "filename.csv");
      fs.writeFileSync(filePath, csv);
      const fileUrl = await uploadToCloudinary(filePath,"CRM/complete",req.body.fileName, 2);
      fs.unlinkSync(filePath);
      // Optionally, send the file as a response or handle it as needed
      res.send({
        status: "success",
        message: "bulk import successful",
        data: { file : fileUrl , client : clients}
      });
    } else {
      // Create a new workbook and add a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      // Write headers
      const headers = Object.keys(this.fieldMapping).map((field) => field);
      worksheet.addRow(headers);

      // Write data
      formattedData.forEach((row, rowIdx) => {
        worksheet.addRow(
          headers.map(
            (header) =>
              row[this.fieldMapping[header]] || bulkData[rowIdx][header]
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
      const outputFilePath = "highlighted_output.xlsx";
      await workbook.xlsx.writeFile(outputFilePath);

      // Send the file to the user
      res.download(outputFilePath, "highlighted_output.xlsx", (err) => {
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

export default TestUploadController;
