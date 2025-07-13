import { Router } from "express";
import { createBook, getBooks, getBookById, updateBook, deleteBook } from "../controllers/book.controller";
import { upload } from "../config/multerCloudinary"; 

const bookRouter = Router();


bookRouter.post("/", upload.single("coverImage"), createBook);
bookRouter.get("/", getBooks);
bookRouter.get("/:id", getBookById);
bookRouter.put("/:id", upload.single("coverImage"), updateBook);
bookRouter.delete("/:id", deleteBook);

export default bookRouter;
