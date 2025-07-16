import { Request, Response, NextFunction } from "express";
import { LendingModel } from "../models/Lending";
import { BookModel } from "../models/Book"; // Assuming Book model is BookModel
import { APIError } from "../errors/ApiError";

export const lendBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId, readerId, dueDate } = req.body;

    const book = await BookModel.findById(bookId);
    if (!book) throw new APIError(404, "Book not found");
    if (book.copiesAvailable < 1) throw new APIError(400, "No copies available");

    const lending = new LendingModel({
      bookId,
      readerId,
      dueDate,
    });
    await lending.save();

    // Update book copies
    book.copiesAvailable -= 1;
    await book.save();

    res.status(201).json({ message: "Book lent successfully", data: lending });
  } catch (err) {
    next(err);
  }
};

export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Lending record ID

    const lending = await LendingModel.findById(id);
    if (!lending) throw new APIError(404, "Lending record not found");
    if (lending.isReturned) throw new APIError(400, "Book already returned");

    lending.isReturned = true;
    lending.returnDate = new Date();
    await lending.save();

    // Increment book copies
    const book = await BookModel.findById(lending.bookId);
    if (book) {
      book.copiesAvailable += 1;
      await book.save();
    }

    res.status(200).json({ message: "Book returned successfully", data: lending });
  } catch (err) {
    next(err);
  }
};

export const getLendingHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lendings = await LendingModel.find()
      .populate("bookId")
      .populate("readerId");
    res.status(200).json(lendings);
  } catch (err) {
    next(err);
  }
};

export const getLendingByReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { readerId } = req.params;
    const lendings = await LendingModel.find({ readerId })
      .populate("bookId");
    res.status(200).json(lendings);
  } catch (err) {
    next(err);
  }
};

export const getLendingByBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const lendings = await LendingModel.find({ bookId })
      .populate("readerId");
    res.status(200).json(lendings);
  } catch (err) {
    next(err);
  }
};

export const deleteLending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const lending = await LendingModel.findById(id);
    if (!lending) throw new APIError(404, "Lending record not found");

    // Update book copies if not returned
    if (!lending.isReturned) {
      const book = await BookModel.findById(lending.bookId);
      if (book) {
        book.copiesAvailable += 1;
        await book.save();
      }
    }

    await LendingModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Lending record deleted successfully" });
  } catch (err) {
    next(err);
  }
};


export const updateLending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { dueDate, readerId, isReturned } = req.body;

    const lending = await LendingModel.findById(id);
    if (!lending) throw new APIError(404, "Lending record not found");

    if (dueDate) lending.dueDate = dueDate;
    if (readerId) lending.readerId = readerId;

    if (typeof isReturned === "boolean") {
      lending.isReturned = isReturned;

      if (isReturned) {
        // Mark as returned — set returnDate if not set
        if (!lending.returnDate) {
          lending.returnDate = new Date();
        }
      } else {
        // Mark as not returned — clear returnDate
        lending.returnDate = null; // (make sure your type allows null)
      }
    }

    await lending.save();

    res.status(200).json({ message: "Lending record updated successfully", data: lending });
  } catch (err) {
    next(err);
  }
};



