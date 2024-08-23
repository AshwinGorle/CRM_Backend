import csv from "csvtojson";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
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
import TenderStageModel from "../../models/ConfigModels/TenderMaster/TenderStageModel.js";
import TenderMasterModel from "../../models/TenderMasterModel.js";
import RevenueMasterModel from "../../models/RevenueMasterModel.js";
import {
  clientFieldMapping,
  contactFieldMap,
  opportunityFieldMap,
  tenderFieldMap,
} from "./fieldMap.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { Readable } from "stream";
import uploadStreamToCloudinary from "../../utils/uploadStreamToCloudinary.js";
import uploadAndGetAvatarUrl from "../../utils/uploadAndGetAvatarUrl.utils.js";
import { parseRevenueData } from "../../utils/upload.utils.js";

class UploadController {
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

    const salesStageMap = await SalesStageMasterModel.find({}).then(
      (salesStage) => {
        return salesStage.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    const salesSubStageMap = await SalesSubStageMasterModel.find({}).then(
      (salesSubStage) => {
        return salesSubStage.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    const relationshipDegreeMap = await RelationshipDegreeModel.find({}).then(
      (RSDegrees) => {
        return RSDegrees.reduce((acc, item) => {
          acc[item.label] = item._id;
          return acc;
        }, {});
      }
    );

    const tenderStageMap = await TenderStageModel.find({}).then((tenders) => {
      return tenders.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    });

    let csvToModelMap = null;

    switch (resource) {
      case "client":
        csvToModelMap = clientFieldMapping;
        break;
      case "contact":
        csvToModelMap = contactFieldMap;
        break;
      case "opportunity":
        csvToModelMap = opportunityFieldMap;
        break;
      case "tender":
        csvToModelMap = tenderFieldMap;
        break;
    }

    let analysisResult = {};
    const formattedData = bulkData.map((row, rowIdx) => {
      let formattedRow = {};
      Object.keys(row).forEach((csvField, colIdx) => {
        const modelField = csvToModelMap[csvField];
        if (modelField) {
          switch (modelField) {
            case "classification":
              formattedRow[modelField] = classificationMap[row[csvField]];
              break;
            case "enteredBy":
              formattedRow[modelField] = staffMap[row[csvField]];
              console.log("enteredBy csv field ----", row[csvField]);
              break;
            case "incorporationType":
              formattedRow[modelField] = incorporationTypeMap[row[csvField]];
              break;
            case "relationshipStatus":
              formattedRow[modelField] = relationshipStatusMap[row[csvField]];
              break;
            case "listedCompany":
              formattedRow[modelField] = row[csvField] === "Listed";
              break;
            case "entryDate":
              formattedRow[modelField] = new Date(row[csvField]);
              break;
            case "relatedContacts":
              formattedRow[modelField] = null;
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
            case "primaryRelationship":
              formattedRow[modelField] = staffMap[row[csvField]];
              break;
            case "secondaryRelationship":
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
            case "officer":
              formattedRow[modelField] = staffMap[row[csvField]]; // Implement getSolutionIdByName function
              break;
            case "bidManager":
              formattedRow[modelField] = staffMap[row[csvField]]; // Implement getSolutionIdByName function
              break;
            case "stage":
              formattedRow[modelField] = tenderStageMap[row[csvField]]; // Implement getSolutionIdByName function
              break;
            case "associatedOpportunity":
              formattedRow[modelField] = null; // Implement getSolutionIdByName function
              break;
            case "bond":
              formattedRow[modelField] =
                bulkData[csvField] == "Y" ? true : false; // Implement getSolutionIdByName function
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
        csvToModelMap = clientFieldMapping;
        break;
      case "contact":
        csvToModelMap = contactFieldMap;
        break;
      case "opportunity":
        csvToModelMap = opportunityFieldMap;
        break;
      case "tender":
        csvToModelMap = tenderFieldMap;
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
    const buffer = await workbook.xlsx.writeBuffer();
    const file = {
      buffer: buffer,
      originalname: `${resource}-${uniqueName}.xlsx`,
    };
    const correctionFileUrl = await uploadAndGetAvatarUrl(
      file,
      `CRM/${resource}/correctionFiles`,
      file.originalname,
      "stream"
    );

    return correctionFileUrl;
  };
  // static getCorrectionFile = async (
  //   bulkData,
  //   resource,
  //   analysisResult,
  //   formattedData
  // ) => {
  //   let csvToModelMap = null;
  //   switch (resource) {
  //     case "client":
  //       csvToModelMap = clientFieldMapping;
  //       break;
  //     case "contact":
  //       csvToModelMap = contactFieldMap;
  //       break;
  //     case "opportunity":
  //       csvToModelMap = opportunityFieldMap;
  //       break;
  //     case "tender":
  //       csvToModelMap = tenderFieldMap;
  //       break;
  //   }

  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Sheet1");

  //   // Write headers
  //   const headers = Object.keys(csvToModelMap).map((field) => field);
  //   worksheet.addRow(headers);
  //   formattedData.forEach((row, rowIdx) => {
  //     worksheet.addRow(
  //       headers.map(
  //         (header) => row[csvToModelMap[header]] || bulkData[rowIdx][header]
  //       )
  //     );
  //   });

  //   // Apply highlights based on the analysisResult
  //   Object.keys(analysisResult).forEach((rowIdx) => {
  //     const cells = analysisResult[rowIdx];
  //     cells.forEach((cell) => {
  //       Object.keys(cell).forEach((colIdx) => {
  //         const cellAddress = worksheet.getCell(
  //           parseInt(rowIdx) + 2,
  //           parseInt(colIdx) + 1
  //         );
  //         cellAddress.fill = {
  //           type: "pattern",
  //           pattern: "solid",
  //           fgColor: { argb: "FFFFC0C0" }, // Light red background
  //         };
  //       });
  //     });
  //   });

  //   // Write the workbook to a file
  //   const uniqueName = Array.from({ length: 4 }, () =>
  //     String.fromCharCode(65 + Math.floor(Math.random() * 26))
  //   ).join("");
  //   const outputFilePath = `CorrectionFiles/${resource}_${uniqueName}.xlsx`;
  //   await workbook.xlsx.writeFile(outputFilePath);
  //   const correctionFileUrl = await uploadToCloudinary(
  //     outputFilePath,
  //     `CRM/${resource}/correctionFiles`,
  //     `${resource}-${uniqueName}`,
  //     2
  //   );
  //   fs.unlinkSync(outputFilePath);
  //   return correctionFileUrl;
  // };
  static streamToBuffer = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
};

  static sendBulkUploadResponse = async(res, check ,bulkData, formattedData, analysisResult, resourceType )=>{
    let EntityModel = null;
    switch(resourceType){
      case 'client' : EntityModel = ClientMasterModel;
      break;
      case 'contact' : EntityModel = ContactMasterModel;
      break;
      case 'tender' : EntityModel = TenderMasterModel;
      break;
      case 'opportunity' : EntityModel = OpportunityMasterModel;
      break;
    }

    if (!check && Object.keys(analysisResult).length === 0) {
      const entities = await EntityModel.insertMany(formattedData);
      const uniqueName = new Date().toLocaleString();
      const ids = entities.map((client) => client._id.toString());
      const csv = parse(ids.map((id) => ({ id })));
      const csvStream = new Readable();
      csvStream.push(csv);
      csvStream.push(null);
      const buffer = await this.streamToBuffer(csvStream);
      const file = {
        buffer: buffer,
        originalname: `${resourceType}-${uniqueName}.csv`,
      };
      // Ensure the directory exists (create if it doesn't)
      const fileUrl = await uploadAndGetAvatarUrl(
        file,
        `CRM/BulkUploads/Backup/${resourceType}`,
        uniqueName,
        "stream"
      );
      res.send({
        status: "success",
        type: "backup",
        message: `${resourceType} bulk import successful`,
        data: { url: fileUrl },
      });
    }else {
      console.log("jumped in else");
      const correctionFileUrl = await this.getCorrectionFile(
        bulkData,
        `${resourceType}`,
        analysisResult,
        formattedData
      );
      res.json({
        status: "success",
        type: "correction",
        message: `There are corrections in this ${resourceType} file!`,
        data: { url: correctionFileUrl },
      });
    }
  }
  

  static uploadClientInBulk = catchAsyncError(async (req, res) => {

    let { check } = req.query;
    check = check === "true" ? true : false;
    const stream = Readable.from(req.file.buffer.toString());
    const bulkData = await csv().fromStream(stream);
    // console.log("csv from steam : ", bulkData);
    const { formattedData, analysisResult } = await this.getFormattedData(
      bulkData,
      `client`
    );

    await this.sendBulkUploadResponse(res, check, bulkData, formattedData, analysisResult, 'client');
    
    return
    if (!check && Object.keys(analysisResult).length === 0) {
      const clients = await ClientMasterModel.insertMany(formattedData);
      const uniqueName = new Date().toLocaleString();
      const ids = clients.map((client) => client._id.toString());
      const csv = parse(ids.map((id) => ({ id })));
      const csvStream = new Readable();
      csvStream.push(csv);
      csvStream.push(null);
      const buffer = await this.streamToBuffer(csvStream);
      const file = {
        buffer: buffer,
        originalname: `client-${uniqueName}.csv`,
      };
      // Ensure the directory exists (create if it doesn't)
      const fileUrl = await uploadAndGetAvatarUrl(
        file,
        "CRM/Client/BulkUploads",
        uniqueName,
        "stream"
      );
      res.send({
        status: "success",
        type: "backup",
        message: "Client bulk import successful",
        data: { url: fileUrl },
      });
    } else {
      console.log("jumped in else");
      const correctionFileUrl = await this.getCorrectionFile(
        bulkData,
        "client",
        analysisResult,
        formattedData
      );
      res.json({
        status: "success",
        type: "correction",
        message: "There are corrections in this client file!",
        data: { url: correctionFileUrl },
      });
    }
  });
  // static uploadClientInBulk = catchAsyncError(async (req, res) => {
  //   const csvFilePath = req.file.path;
  //   let { check } = req.query;
  //   check = check === 'true' ? true : false;
  //   const bulkData = await csv().fromFile(csvFilePath);
  //   const { formattedData, analysisResult } = await this.getFormattedData(
  //     bulkData,
  //     "client"
  //   );

  //   if (!check && Object.keys(analysisResult).length === 0) {
  //     console.log("directory name----");
  //     const clients = await ClientMasterModel.insertMany(formattedData);
  //     console.log("all clients", clients);
  //     const ids = clients.map((client) => client._id.toString());
  //     const csv = parse(ids.map((id) => ({ id })));
  //     const tempUploadDir = path.join(process.cwd(), "tempUpload");
  //     // Ensure the directory exists (create if it doesn't)
  //     if (!check === "true" && !fs.existsSync(tempUploadDir)) {
  //       fs.mkdirSync(tempUploadDir);
  //     }
  //     const filePath = path.join(tempUploadDir, "filename.csv");
  //     fs.writeFileSync(filePath, csv);
  //     const uniqueName = new Date().toLocaleString();
  //     const fileUrl = await uploadToCloudinary(
  //       filePath,
  //       "CRM/Client/BulkUploads",
  //       uniqueName,
  //       2
  //     );
  //     fs.unlinkSync(filePath);
  //     res.send({
  //       status: "success",
  //       type : "backup",
  //       message: "Client bulk import successful",
  //       data: { url: fileUrl, client: clients },
  //     });
  //   } else {
  //     console.log("jumped in else")
  //     const correctionFileUrl = await this.getCorrectionFile(
  //       bulkData,
  //       "client",
  //       analysisResult,
  //       formattedData
  //     );
  //     res.json({
  //       status: "success",
  //       type:"correction",
  //       message: "There are corrections in this client file!",
  //       data: { url: correctionFileUrl },
  //     });
  //   }
  // });

  static uploadContactInBulk = catchAsyncError(async (req, res) => {
    // const csvFilePath = req.file.path;
    let { check } = req.query;
    check = check === "true" ? true : false;
    const stream = Readable.from(req.file.buffer.toString());
    const bulkData = await csv().fromStream(stream);
    const { formattedData, analysisResult } = await this.getFormattedData(
      bulkData,
      "contact"
    );
    console.log("analysis result ---", analysisResult);
    console.log("formatted data ---", formattedData);
    await this.sendBulkUploadResponse(res, check, bulkData, formattedData, analysisResult, 'contact');
    return
    check = check === "true" ? true : false;
    if (!check && Object.keys(analysisResult).length === 0) {
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
        message: "contact bulk import successful",
        data: { file: fileUrl, contacts: contacts },
      });
    } else {
      const correctionFileUrl = await this.getCorrectionFile(
        bulkData,
        "contact",
        analysisResult,
        formattedData
      );
      res.json({
        status: "success",
        message: "There are corrections in this contact file!",
        data: { url: correctionFileUrl },
      });
    }
  });

  static generateRevenues = async (dataArray) => {
    const resultArray = [];
    for (let i = 0; i < dataArray.length; i++) {
      const innerArray = dataArray[i];
      const revenueIds = [];
      for (let j = 0; j < innerArray.length; j++) {
        const revenueData = innerArray[j];
        const revenue = new RevenueMasterModel({
          year: revenueData.year,
          Q1: revenueData.Q1,
          Q2: revenueData.Q2,
          Q3: revenueData.Q3,
          Q4: revenueData.Q4,
        });
        const savedRevenue = await revenue.save();
        revenueIds.push(savedRevenue._id);
      }
      resultArray.push(revenueIds);
    }
    return resultArray;
  };

  static uploadOpportunityInBulk = catchAsyncError(async (req, res) => {
    let { check } = req.query;
    check = check == 'true' ? true : false;
    const stream = Readable.from(req.file.buffer.toString());
    const bulkData = await csv().fromStream(stream);
    const indexToRemove = 0;
    const updatedBulkData = bulkData
      .slice(0, indexToRemove)
      .concat(bulkData.slice(indexToRemove + 1)); // removing the second row from bukdata

    console.log("updated bulk data ----", updatedBulkData);
    console.log("bulk data---", bulkData);

    const { formattedData, analysisResult } = await this.getFormattedData(
      updatedBulkData,
      "opportunity"
    );
    

    const revenueData = parseRevenueData(bulkData);
      const revenueIdData = await this.generateRevenues(revenueData);
      console.log(revenueData);
      console.log(revenueIdData);
      revenueIdData.forEach((revenueArray, idx) => {
        formattedData[idx]["revenue"] = revenueArray;
      });
    
    console.log("analysis result ---", analysisResult);
    console.log("formatted data after revenue---", formattedData);
    
    await this.sendBulkUploadResponse(res, check, bulkData, formattedData, analysisResult, 'opportunity');
    return
    if (!check && Object.keys(analysisResult).length === 0) {
      console.log("directory name----");
      const revenueData = this.parseRevenueData(bulkData);
      const revenueIdData = await this.generateRevenues(revenueData);
      console.log(revenueData);
      console.log(revenueIdData);
      revenueIdData.forEach((revenueArray, idx) => {
        formattedData[idx]["revenue"] = revenueArray;
      });
      console.log("formatted data with revenue", formattedData);

      const opportunities = await OpportunityMasterModel.insertMany(
        formattedData
      );
      // console.log("all contacts", contacts);
      const ids = opportunities.map((opportunity) =>
        opportunity._id.toString()
      );
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
        message: "Opportunity bulk import successful !",
        data: { file: fileUrl, opportunities: opportunities },
      });
    } else {
      const correctionFileUrl = await this.getCorrectionFile(
        bulkData,
        "opportunity",
        analysisResult,
        formattedData
      );
      console.log("correction file path", correctionFileUrl);
      return res.json({
        status: "success",
        message: "There are corrections in Opp. file!",
        type: "correction",
        data: { url: correctionFileUrl },
      });
    }
  });

  static uploadTenderInBulk = catchAsyncError(async (req, res) => {
    
    let { check } = req.query;
    check = check === "true" ? true : false;
    const stream = Readable.from(req.file.buffer.toString());
    const bulkData = await csv().fromStream(stream);
    console.log("tender bulk data ", bulkData);
    const { formattedData, analysisResult } = await this.getFormattedData(
      bulkData,
      "tender"
    );
    console.log("analysis result ---", analysisResult);
    console.log("formatted data ---", formattedData);
    await this.sendBulkUploadResponse(res, check, bulkData, formattedData, analysisResult, 'tender');
    return
    if (!check && Object.keys(analysisResult).length === 0) {
      console.log("directory name----");
      const tenders = await TenderMasterModel.insertMany(formattedData);
      console.log("all tenders", tenders);
      const ids = tenders.map((tender) => tender._id.toString());
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
        "CRM/Tender/BulkUploads",
        uniqueName,
        2
      );
      fs.unlinkSync(filePath);
      res.send({
        status: "success",
        message: "Tender bulk import successful!",
        data: { url: fileUrl, tenders: tenders },
      });
    } else {
      const correctionFileUrl = await this.getCorrectionFile(
        bulkData,
        "tender",
        analysisResult,
        formattedData
      );
      // console.log("correction file path", correctionFilePath);
      res.json({
        status: "success",
        message: "There are corrections in this contact file!",
        data: { url: correctionFileUrl },
      });
    }
  });
}

export default UploadController;
