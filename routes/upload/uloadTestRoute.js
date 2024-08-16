import { Router } from "express";
import TestUploadCOntroller from '../../controllers/upload/testUploadController.js'
const  uploadRouter = Router();

uploadRouter.post('/',TestUploadCOntroller.uploadData)

export default uploadRouter;