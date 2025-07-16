import type { Reader } from "../types/Reader"
import apiClient from "./apiClient"

export const getAllReaders = async (): Promise<Reader[]> => {
  const response = await apiClient.get("/readers")
  return response.data
}

export const addReader = async (readerData: FormData): Promise<Reader> => {
  const response = await apiClient.post("/readers/save", readerData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data; // Note: access `.data.data`
};


export const updateReader = async (_id: string, readerData: FormData): Promise<Reader> => {
  const response = await apiClient.put(`/readers/${_id}`, readerData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data; // Note: access `.data.data`);

};



export const deleteReader = async (_id: string): Promise<void> => {
  await apiClient.delete(`/readers/${_id}`)
}

export const getReader = async (_id: string): Promise<Reader> => {
  const response = await apiClient.get(`/readers/${_id}`)
  return response.data
}
