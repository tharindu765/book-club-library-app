import { createActivity, getRecentActivities } from "../controllers/activity.controller";

const express = require("express");
const activityRouter = express.Router();


activityRouter.get("/", getRecentActivities);
activityRouter.post("/", createActivity);

export default activityRouter

