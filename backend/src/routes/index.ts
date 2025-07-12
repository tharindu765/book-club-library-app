import { Router } from "express";
import readerRouter from "./reader.route";
import userRouter from "./user.router";

const rootRouter = Router()
rootRouter.use("/readers",readerRouter)
rootRouter.use("/auth",userRouter)

export default rootRouter