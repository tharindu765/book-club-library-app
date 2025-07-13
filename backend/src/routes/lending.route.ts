import { Router } from "express";
import {
  lendBook,
  returnBook,
  getLendingHistory,
  getLendingByReader,
  getLendingByBook
} from "../controllers/lending.controller";

const lendingRouter = Router();

lendingRouter.post("/lend", lendBook);
lendingRouter.post("/return/:id", returnBook);
lendingRouter.get("/", getLendingHistory);
lendingRouter.get("/reader/:readerId", getLendingByReader);
lendingRouter.get("/book/:bookId", getLendingByBook);

export default lendingRouter;
