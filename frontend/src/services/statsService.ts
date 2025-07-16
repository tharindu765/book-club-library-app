import apiClient from "./apiClient";


export const StatsService = {
  getDashboardStats: () => apiClient.get("/stats"),
};
