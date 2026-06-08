import express from "express"
import { getTask,updateTask, deleteTask, createTask, toggleStatus } from "../controllers/taskController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, getTask);
router.post("/",protect, createTask);
router.put("/:id",protect, updateTask);
router.delete("/:id",protect, deleteTask);
router.patch("/:id/toggle",protect, toggleStatus);

export default router;