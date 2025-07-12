import { Router } from "express";
import readerRouter from "./reader.route";

const rootRouter = Router()
rootRouter.use("/readers",readerRouter)

export default rootRouter