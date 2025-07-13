import mongoose, { Schema, Document } from 'mongoose';

export interface IReader extends Document {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  membershipDate: Date;
  lastActivity: Date;
  notes?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const readerSchema: Schema = new Schema<IReader>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\d+\-() ]{7,20}$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    membershipDate: {
      type: Date,
      default: Date.now,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    photo: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ReaderModel = mongoose.model<IReader>('Reader', readerSchema);
