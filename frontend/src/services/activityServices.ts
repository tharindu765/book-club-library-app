// src/services/activityService.ts

import type { Activity } from "../types/Activity";
import apiClient from "./apiClient";

const getRecentActivities = async (): Promise<Activity[]> => {
  const res = await apiClient.get<Activity[]>("/activities");
  return res.data;
};
const logActivity = (type: Activity["type"], message: string) => {
  return apiClient.post("/activities", {
    type,
    message,
  });
};

export default {
  getRecentActivities,
  logActivity,
};