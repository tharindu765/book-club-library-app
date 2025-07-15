export interface Reader {
  _id: string
  fullName: string
  email: string
  phone: string
  address: string
  isActive: boolean
  membershipDate: string
  lastActivity: string
  notes?: string
  photo?: string
  createdAt: string
  updatedAt: string
}
export interface ReaderFormData {
  fullName: string
  email: string
  phone: string
  address: string
  notes: string
  photo: string
  isActive: boolean
  membershipDate: string
  lastActivity: string
}
