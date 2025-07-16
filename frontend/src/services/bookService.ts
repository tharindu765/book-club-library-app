import type { Book } from "../types/ Book";
import apiClient from "./apiClient";

export const bookService = {
  getAll: async (): Promise<Book[]> => {
    const res = await apiClient.get("/books");
    return res.data;
  },

  getById: async (id: string): Promise<Book> => {
    const res = await apiClient.get(`/books/${id}`);
    return res.data;
  },

  create: async (formData: FormData): Promise<Book> => {
    const res = await apiClient.post("/books", formData,  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data; 
},

  update: async (id: string, formData: FormData): Promise<Book> => {
    const res = await apiClient.put(`/books/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data; 
},
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
  },
};
