import { Router } from "express";
import TestUploadCOntroller from '../../controllers/upload/testUploadController.js'
import upload from "../../utils/storage.utils.js";

const  uploadRouter = Router();

uploadRouter.post('/', upload.single('dataFile'), TestUploadCOntroller.uploadData)

export default uploadRouter;