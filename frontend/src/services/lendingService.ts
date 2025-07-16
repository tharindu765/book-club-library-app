import apiClient from "./apiClient";

export const lendingService = {
  lend: (data: { bookId: string; readerId: string; dueDate: string }) =>
    apiClient.post("/lendings/lend", data),

  returnBook: (lendingId: string) =>
    apiClient.post(`/lendings/return/${lendingId}`),

  getAll: () => apiClient.get("/lendings"),

  getByReader: (readerId: string) =>
    apiClient.get(`/lendings/reader/${readerId}`),

  getByBook: (bookId: string) =>
    apiClient.get(`/lendings/book/${bookId}`),
   
  delete: (lendingId: string) =>
    apiClient.delete(`/lendings/${lendingId}`),

  update: (
    lendingId: string,
    data: Partial<{ dueDate: string; readerId: string }>
  ) => apiClient.put(`/lendings/${lendingId}`, data),
  

};
