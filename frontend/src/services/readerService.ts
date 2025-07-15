import type { Reader } from "../types/reader"
import apiClient from "./apiClient"

export const getAllReaders = async (): Promise<Reader[]> => {
  const response = await apiClient.get("/readers")
  return response.data
}

export const addReader = async (readerData: Omit<Reader, "_id" | "createdAt" | "updatedAt">): Promise<Reader> => {
  const response = await apiClient.post("/readers/save", readerData)
  return response.data
}

export const updateReader = async (_id: string, readerData: Partial<Omit<Reader, "_id" | "createdAt" | "updatedAt">>): Promise<Reader> => {
  const response = await apiClient.put(`/readers/${_id}`, readerData)
  return response.data
}

export const deleteReader = async (_id: string): Promise<void> => {
  await apiClient.delete(`/readers/${_id}`)
}

export const getReader = async (_id: string): Promise<Reader> => {
  const response = await apiClient.get(`/readers/${_id}`)
  return response.data
}
