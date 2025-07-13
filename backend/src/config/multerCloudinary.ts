import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "book-club-readers", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  } as any,
});

export const upload = multer({ storage });
