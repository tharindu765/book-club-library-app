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
  createdAt: Date;
  updatedAt: Date;
}

const readerSchema: Schema = new Schema<IReader>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
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
    },
  },
  {
    timestamps: true, 
  }
);

export const ReaderModel = mongoose.model<IReader>('Reader', readerSchema);
