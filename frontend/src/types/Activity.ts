export type ActivityType = "book-added" | "reader-registered" | "book-returned";

export type Activity = {
  id: string; // MongoDB ObjectId string from backend _id
  type: ActivityType;
  description?: string; // from backend's description field
  user?: {
    name: string;
    id: string;
  };
  book?: {
    title: string;
    id: string;
  };
  timestamp: string; // ISO string date from backend
};
