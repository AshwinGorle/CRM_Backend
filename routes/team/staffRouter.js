import { Router } from "express";
import StaffController from "../../controllers/TeamMaster/staffController.js";
const staffRouter = Router();

staffRouter.get("/", StaffController.getAllStaff)
staffRouter.get("/:id", StaffController.getStaff)
staffRouter.post("/", StaffController.createStaff)
staffRouter.put("/:id",StaffController.updateStaff)
staffRouter.delete("/:id",StaffController.deleteStaff);

export default staffRouter; 