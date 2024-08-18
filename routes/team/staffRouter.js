import { Router } from "express";
import StaffController from "../../controllers/TeamMaster/staffController.js";
import upload from "../../utils/storage.utils.js";
const staffRouter = Router();

staffRouter.get("/", StaffController.getAllStaff)
staffRouter.get("/:id", StaffController.getStaff)
staffRouter.post("/", upload.single('avatar'), StaffController.createStaff)
staffRouter.put("/:id", upload.single('avatar') ,StaffController.updateStaff)
staffRouter.delete("/:id",StaffController.deleteStaff);

export default staffRouter; 