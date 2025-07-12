import { Document, Schema, model } from 'mongoose';

// 1. Define the interface
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'staff'; 
  createdAt: Date;
  updatedAt: Date;
}


const userSchema = new Schema<IUser>(
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
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'staff'],
      default: 'staff',
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);

