import mongoose, { Document, Schema } from 'mongoose';

export interface ILending extends Document {
  bookId: mongoose.Types.ObjectId;
  readerId: mongoose.Types.ObjectId;
  lendDate: Date;
  dueDate: Date;
  returnDate?: Date;
  isReturned: boolean;
}

const lendingSchema = new Schema<ILending>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    readerId: {
      type: Schema.Types.ObjectId,
      ref: 'Reader',
      required: true,
    },
    lendDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const LendingModel = mongoose.model<ILending>('Lending', lendingSchema);
