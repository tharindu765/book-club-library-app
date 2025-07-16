import express from "express";
import { sendDueDateEmail } from "../controllers/mail";


const mailRouter = express.Router();

mailRouter.post("/", sendDueDateEmail);

export default mailRouter;
