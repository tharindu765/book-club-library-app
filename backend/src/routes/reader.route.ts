import { Router } from "express";
import { createReader, getReaders, getReaderById, updateReader, deleteReader } from "../controllers/reader.controller";
import { upload } from "../config/multerCloudinary";

const readerRouter = Router();

// Create reader WITH photo
readerRouter.post("/save", upload.single("photo"), createReader);

readerRouter.get("/", getReaders);
readerRouter.get("/:id", getReaderById);
readerRouter.put("/:id", updateReader);
readerRouter.delete("/:id", deleteReader);

export default readerRouter;
