export interface Lending {
  _id: string;
  bookId: {
    _id: string;
    title: string;
  };
  readerId: {
    _id: string;
    fullName: string;
  };
  lendDate: string;
  dueDate: string;
  returnDate?: string;
  isReturned: boolean;
}

export interface LendingFormData {
  bookId: string;
  readerId: string;
  dueDate: string;
}
