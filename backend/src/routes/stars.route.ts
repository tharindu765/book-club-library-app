import { Router } from "express";
import { getDashboardStats } from "../controllers/stats.controller";
const statsRouter = Router();

statsRouter.get("/",getDashboardStats)

export default statsRouter