import { NextFunction, Request, Response } from "express";
import { BookModel } from "../models/Book";
import { ReaderModel } from "../models/Reders";
import { LendingModel } from "../models/Lending";

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalBooks = await BookModel.countDocuments();
    const totalReaders = await ReaderModel.countDocuments();

    const activeLendings = await LendingModel.countDocuments({ isReturned: false });

    const overdueLendings = await LendingModel.countDocuments({
      isReturned: false,
      dueDate: { $lt: new Date() }
    });


    res.json({
      totalBooks,
      totalReaders,
      activeLendings,
      overdueLendings
    });
  } catch (error) {
    next(error);
  }
};
