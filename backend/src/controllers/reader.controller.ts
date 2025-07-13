import { NextFunction, Request, Response } from "express";
import { ReaderModel } from "../models/Reders";
import { APIError } from "../errors/ApiError";

// Create a new reader
export const createReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, phone, address, isActive, notes } = req.body;

    const photo = req.file ? req.file.path : undefined; // Cloudinary returns file.path as URL

    const reader = new ReaderModel({
      fullName,
      email,
      phone,
      address,
      isActive,
      notes,
      photo,
    });

    await reader.save();

    res.status(201).json({
      message: "Reader created",
      data: reader,
    });
  } catch (error) {
    next(error);
  }
};


// Get all readers
export const getReaders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readers = await ReaderModel.find();
    res.status(200).json(readers);
  } catch (error) {
    next(error);
  }
};

// Get a reader by ID
export const getReaderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reader = await ReaderModel.findById(req.params.id);
    if (!reader) {
      throw new APIError(404, "Reader not found");
    }
    res.status(200).json(reader);
  } catch (error) {
    next(error);
  }
};

// Delete a reader by ID
export const deleteReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reader = await ReaderModel.findByIdAndDelete(req.params.id);
    if (!reader) {
      throw new APIError(404, "Reader not found");
    }
    res.status(200).json({ message: "Reader deleted", data: reader });
  } catch (error) {
    next(error);
  }
};

// Update a reader by ID
export const updateReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reader = await ReaderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!reader) {
      throw new APIError(404, "Reader not found");
    }

    res.status(200).json({ message: "Reader updated", data: reader });
  } catch (error) {
    next(error);
  }
};
