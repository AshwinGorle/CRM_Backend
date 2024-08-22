import { Router } from "express";
import UploadController from '../../controllers/upload/testUploadController.js'
import upload from "../../utils/storage.utils.js";
import uploadStream from "../../utils/memoryStorage.utils.js";

const  uploadRouter = Router();

uploadRouter.post('/client', uploadStream.single('dataFile'), UploadController.uploadClientInBulk);
uploadRouter.post('/contact', upload.single('dataFile'), UploadController.uploadContactInBulk);
uploadRouter.post('/opportunity', upload.single('dataFile'), UploadController.uploadOpportunityInBulk);
uploadRouter.post('/tender', upload.single('dataFile'), UploadController.uploadTenderInBulk);

export default uploadRouter;