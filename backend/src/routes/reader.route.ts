import { Router } from "express";
import { createReader } from "../controllers/reader.controller";

const readerRouter = Router()

readerRouter.post("/save",createReader)

export default readerRouter