import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";
import { ReaderModel } from "../models/Reders";
import "dotenv/config";
import { LendingModel } from "../models/Lending";

export const sendDueDateEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { readerId, lendingId } = req.body;

    // Find reader
    const reader = await ReaderModel.findById(readerId);
    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    // Find lending and populate book
    const lending = await LendingModel.findById(lendingId).populate("bookId");
    if (!lending) {
      return res.status(404).json({ message: "Lending record not found" });
    }

        // 3. Extract book title
    const bookTitle = (lending.bookId as any).title;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Library" <${process.env.EMAIL_USER}>`,
      to: reader.email,
      subject: "Book Due Date Reminder",
      text: `Hello ${reader.fullName},

This is a reminder that your borrowed book "${bookTitle}" (Lending ID: ${lendingId}) is overdue.

Please return it as soon as possible.

Thank you!`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    next(error);
  }
};
