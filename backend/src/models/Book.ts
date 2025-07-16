import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  publishedYear: number;
  copiesAvailable: number;
  coverImage?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      min: [1500, "Published year seems too old"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
    copiesAvailable: {
      type: Number,
      required: [true, "Number of copies is required"],
      min: [0, "Copies cannot be negative"],
    },
    coverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const BookModel = mongoose.model<IBook>('Book', bookSchema);
