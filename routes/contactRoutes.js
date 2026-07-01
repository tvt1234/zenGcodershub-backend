
import express from "express";
import {
  sendMessage,
  getAllMessages,
  deleteContactMessage,

} from "../controllers/contactController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/all", getAllMessages);
router.delete("/delete/:id", deleteContactMessage);

export default router;