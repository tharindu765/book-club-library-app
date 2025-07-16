export type Book = {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  publishedYear: number;
  copiesAvailable: number;
  coverImage?: string | File;
  createdAt?: string;
  updatedAt?: string;
};
