import { Request, Response, NextFunction } from "express";
import { BookModel } from "../models/Book";
import { APIError } from "../errors/ApiError";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, isbn, category, description, publishedYear, copiesAvailable } = req.body;
    const coverImage = req.file ? req.file.path : undefined;

    const book = new BookModel({ title, author, isbn, category, description, publishedYear, copiesAvailable, coverImage });
    await book.save();

    res.status(201).json({ message: "Book created", data: book });
  } catch (err) {
    next(err);
  }
};

export const getBooks = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await BookModel.find();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) throw new APIError(404, "Book not found");
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.coverImage = req.file.path;
    }

    const book = await BookModel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!book) throw new APIError(404, "Book not found");

    res.status(200).json({ message: "Book updated", data: book });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await BookModel.findByIdAndDelete(req.params.id);
    if (!book) throw new APIError(404, "Book not found");
    res.status(200).json({ message: "Book deleted", data: book });
  } catch (err) {
    next(err);
  }
};
