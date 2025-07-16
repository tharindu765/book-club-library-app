import { Router } from "express";
import readerRouter from "./reader.route";
import userRouter from "./user.router";
import bookRouter from "./book.route";
import lendingRouter from "./lending.route";
import statsRouter from "./stars.route";
import activityRouter from "./activityRoutes";
import mailRouter from "./mail.route";

const rootRouter = Router()
rootRouter.use("/readers",readerRouter)
rootRouter.use("/auth",userRouter)
rootRouter.use("/books",bookRouter)
rootRouter.use("/lendings",lendingRouter)
rootRouter.use("/stats",statsRouter)
rootRouter.use("/activities",activityRouter)
rootRouter.use("/send-due-email",mailRouter)

export default rootRouter