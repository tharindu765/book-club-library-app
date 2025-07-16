import { Router } from "express";
import { createReader, getReaders, getReaderById, updateReader, deleteReader } from "../controllers/reader.controller";
import { upload } from "../config/multerCloudinary";
import { authenticateToken } from "../middlewares/auth";

const readerRouter = Router();

// Create reader WITH photo
readerRouter.post("/save", upload.single("photo"), createReader);

readerRouter.get("/",authenticateToken, getReaders);
readerRouter.get("/:id", getReaderById);
readerRouter.put("/:id", upload.single("photo"), updateReader);
readerRouter.delete("/:id", deleteReader);

export default readerRouter;
