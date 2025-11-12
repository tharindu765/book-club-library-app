import { useEffect, useState } from "react"
import { Search, User, Mail, Phone, MapPin, Calendar, Activity, Plus, Filter, Edit, Trash2, X, Save } from "lucide-react"

import {
  getAllReaders,
  addReader,
  updateReader,
  deleteReader
} from "../services/readerService"
import type { Reader, ReaderFormData } from "../types/reader"

const ReadersPage = () => {
  const [readers, setReaders] = useState<Reader[]>([])
  const [filteredReaders, setFilteredReaders] = useState<Reader[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<ReaderFormData>({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  photo: "",
  isActive: true,
  membershipDate: new Date().toISOString().split("T")[0],
  lastActivity: new Date().toISOString()
})
  const [editingReader, setEditingReader] = useState<Reader | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const data = await getAllReaders()
      setReaders(data)
      setFilteredReaders(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching readers:", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // CRUD Functions
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      photo: "",
      isActive: true,
      membershipDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString()
    })
    setEditingReader(null)
  }

  const openModal = (reader?: Reader) => {
    if (reader) {
      setEditingReader(reader)
      setFormData({
        fullName: reader.fullName,
        email: reader.email,
        phone: reader.phone,
        address: reader.address,
        notes: reader.notes || "",
        photo: reader.photo || "",
        isActive: reader.isActive,
        membershipDate: reader.membershipDate.split('T')[0],
        lastActivity: reader.lastActivity
      })
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {const updateReaderData = new FormData();

updateReaderData.append("fullName", formData.fullName);
updateReaderData.append("email", formData.email);
updateReaderData.append("phone", formData.phone);
updateReaderData.append("address", formData.address);
updateReaderData.append("notes", formData.notes);
updateReaderData.append("isActive", String(formData.isActive));
updateReaderData.append("membershipDate", formData.membershipDate);
updateReaderData.append("lastActivity", formData.lastActivity);

if (formData.photo) {
  if (formData.photo instanceof File) {
    updateReaderData.append("photo", formData.photo);
  } else if (typeof formData.photo === "string") {
    // For update, if you want to keep the old photo URL, you can send photo as string:
    updateReaderData.append("photo", formData.photo);
  }
}

    if (editingReader) {
      // Update reader (backend should also accept FormData in PUT if needed!)
      await updateReader(editingReader._id, updateReaderData);
    } else {
       await addReader(updateReaderData);

      //await activityServices.logActivity(
        //"reader-registered",
        //`Added new reader: ${formData.fullName}`,
    //  );
    }
    fetchData();
    closeModal();
  } catch (err) {
    console.error("Error saving reader:", err);
  } finally {
    setIsSubmitting(false);
  }
};


  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this reader?")) {
      try {
        await deleteReader(id)
        setReaders(prev => prev.filter(r => r._id !== id))
      } catch (err) {
        console.error("Error deleting reader:", err)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormData(prev => ({
      ...prev,
      photo: file,
    }));
  }
};



  useEffect(() => {
    let filtered = readers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reader =>
        reader.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reader.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filter === "active") {
      filtered = filtered.filter(reader => reader.isActive)
    } else if (filter === "inactive") {
      filtered = filtered.filter(reader => !reader.isActive)
    }

    setFilteredReaders(filtered)
  }, [searchTerm, filter, readers])

  const formatDate = (dateString:string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInitials = (FullName?:string) => {
    if (!FullName) return "?"
    return FullName.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Readers</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your book club members
              </p>
            </div>
            <button 
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Add Reader
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search readers by name, email, or notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={20} />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Readers</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <User className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Readers</p>
                <p className="text-2xl font-bold text-gray-900">{readers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <Activity className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {readers.filter(r => r.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {readers.filter(r => 
                    new Date(r.membershipDate).getMonth() === new Date().getMonth() &&
                    new Date(r.membershipDate).getFullYear() === new Date().getFullYear()
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Readers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReaders.map((reader) => (
            <div key={reader._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header with avatar and status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {reader.photo ? (
                      <img
                        src={reader.photo}
                        alt={reader.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(reader.fullName)}
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{reader.fullName}</h3>
                      <p className="text-sm text-gray-500">Member since {formatDate(reader.membershipDate)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reader.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {reader.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span className="truncate">{reader.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="mr-2" />
                    <span>{reader.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span className="truncate">{reader.address}</span>
                  </div>
                </div>

                {/* Notes */}
                {reader.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">{reader.notes}</p>
                  </div>
                )}

                {/* Last Activity */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <span>Last activity: {formatDate(reader.lastActivity)}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openModal(reader)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(reader._id)}
                      className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReaders.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No readers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding a new reader'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingReader ? 'Edit Reader' : 'Add New Reader'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="membershipDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Membership Date *
                  </label>
                  <input
                    type="date"
                    id="membershipDate"
                    name="membershipDate"
                    value={formData.membershipDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

<div>
  <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
    Photo
  </label>
  <div className="relative">
    <input
      type="file"
      id="photo"
      name="photo"
      accept="image/*"
      onChange={handleFileChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2 text-gray-700">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm">
          {formData.photo ? 'Change photo' : 'Choose photo'}
        </span>
      </div>
    </div>
  </div>

  {formData.photo && (
    <div className="mt-2 flex items-center gap-2">
      {typeof formData.photo === "string" ? (
        <img src={formData.photo} alt="Preview" className="w-16 h-16 object-cover rounded" />
      ) : (
        <p className="text-xs text-gray-500">{formData.photo.name}</p>
      )}
      <button
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, photo: "" }))}
        className="text-red-600 hover:text-red-800 text-xs underline"
      >
        Remove
      </button>
    </div>
  )}
</div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about the reader..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active Member
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {editingReader ? 'Update' : 'Create'} Reader
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReadersPage