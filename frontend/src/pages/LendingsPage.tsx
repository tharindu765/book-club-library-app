import { useState, useEffect } from "react";
import { Plus, BookOpen, Users, Calendar, CheckCircle, XCircle, Edit2, Trash2, Search, Filter, Bell, AlertTriangle } from "lucide-react";
import type { Lending, LendingFormData } from "../types/lending";
import { lendingService } from "../services/lendingService";
import type { Book } from "../types/ Book";
import { bookService } from "../services/bookService";
import { getAllReaders } from "../services/readerService";
import type { Reader } from "../types/reader";
import apiClient from "../services/apiClient";

// Enhanced form data type to include isActive
interface EnhancedLendingFormData extends LendingFormData {
  isActive?: boolean;
}

export default function LendingPage() {
  const [formData, setFormData] = useState<EnhancedLendingFormData>({
    bookId: "",
    readerId: "",
    dueDate: "",
    isActive: true,
  });
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "returned" | "overdue">("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'warning' | 'error'}>>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
  checkOverdueNotifications();

  // Optional: Re-run periodically after initial mount and whenever data changes
  //const interval = setInterval(checkOverdueNotifications, 60000);
  //return () => clearInterval(interval);
}, [lendings, books, readers]);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const bell = document.getElementById("notification-bell");
    if (bell && !bell.contains(e.target as Node)) {
      setShowNotificationsDropdown(false);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


  // Check for overdue books and create notifications
const checkOverdueNotifications = () => {
  const now = new Date();
  const overdueBooks = lendings.filter(lending => 
    !lending.isReturned && 
    new Date(lending.dueDate) < now
  );

  const newNotifications = overdueBooks.map(lending => {
    const book = books.find(b => b._id === lending?.bookId._id);
    const reader = readers.find(r => r._id === lending?.readerId._id);

    return {
      id: lending._id,
      message: `"${book?.title || 'Unknown Book'}" borrowed by ${reader?.fullName || 'Unknown Reader'} is overdue!`,
      type: 'warning' as const
    };
  });

  setNotifications(prev => {
    const filtered = prev.filter(n => !overdueBooks.some(ob => ob._id === n.id));
    return [...filtered, ...newNotifications];
  });
};

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookRes, readerRes, lendingRes] = await Promise.all([
        bookService.getAll(),
        getAllReaders(),
        lendingService.getAll(),
      ]);
      setBooks(bookRes);
      setReaders(readerRes);
      setLendings(lendingRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.bookId || !formData.readerId || !formData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      if (editingId) {
        // For updates, include isActive status
        const updateData = {
          ...formData,
          isReturned: !formData.isActive // If not active, it's returned
        };
        await lendingService.update(editingId, updateData);
        setEditingId(null);
      } else {
        await lendingService.lend(formData);
      }
      fetchData();
      resetForm();
    } catch (err) {
      console.error("Operation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lending: Lending) => {
    setFormData({
      bookId: lending.bookId._id,
      readerId: lending.readerId._id,
      dueDate: lending.dueDate.split('T')[0],
      isActive: !lending.isReturned, // Active means not returned
    });
    setEditingId(lending._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lending record?")) {
      setLoading(true);
      try {
        await lendingService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Delete failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReturn = async (id: string) => {
    setLoading(true);
    try {
      await lendingService.returnBook(id);
      fetchData();
      // Remove notification for this lending if it exists
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Return failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ bookId: "", readerId: "", dueDate: "", isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredLendings = lendings.filter(lending => {
    const matchesSearch = 
      lending.bookId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lending.readerId.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
  filterStatus === "all" ||
  (filterStatus === "active" && !lending.isReturned && new Date(lending.dueDate) >= new Date()) ||
  (filterStatus === "returned" && lending.isReturned) ||
  (filterStatus === "overdue" && !lending.isReturned && new Date(lending.dueDate) < new Date());
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (lending: Lending) => {
    if (lending.isReturned) return "text-green-600 bg-green-50";
    const isOverdue = new Date(lending.dueDate) < new Date();
    return isOverdue ? "text-red-600 bg-red-50" : "text-yellow-600 bg-yellow-50";
  };

  const getStatusText = (lending: Lending) => {
    if (lending.isReturned) return "Returned";
    const isOverdue = new Date(lending.dueDate) < new Date();
    return isOverdue ? "Overdue" : "Active";
  };

const handleSendEmail = async (lendingId: string) => {
  const lending = lendings.find(l => l._id === lendingId);
  if (!lending) {
    alert("Lending not found");
    return;
  }

  try {
    await apiClient.post("/send-due-email", {
      readerId: lending.readerId._id,
      lendingId: lending._id,
    });

    alert("Email sent to user!");
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Failed to send email.");
  }
};

  const overdueCount = lendings.filter(l => !l.isReturned && new Date(l.dueDate) < new Date()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
    {/*    {notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-yellow-600" size={20} />
                  <span className="text-yellow-800">{notification.message}</span>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="text-yellow-600 hover:text-yellow-800 transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
    */}
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📚 Library Lending System
              </h1>
              <p className="text-gray-600">Manage book loans and track returns efficiently</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
<div id="notification-bell" className="relative">
  <button
    onClick={() => setShowNotificationsDropdown(prev => !prev)}
    className="relative"
  >
    <Bell className="text-gray-600" size={24} />
    {notifications.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {notifications.length}
      </span>
    )}
  </button>

  {showNotificationsDropdown && (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-xl z-50">
      {notifications.length === 0 ? (
        <div className="p-4 text-gray-500 text-sm">No notifications</div>
      ) : (
        <ul className="divide-y divide-gray-100 max-h-80 overflow-auto">
          {notifications.map((notification) => (
            <li key={notification.id} className="p-4 flex items-start justify-between gap-2 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" size={20} />
                <span className="text-sm text-gray-800">{notification.message}</span>
              </div>
              <button onClick={() => dismissNotification(notification.id)}>
                <XCircle className="text-gray-400 hover:text-red-500" size={18} />
              </button>
              <button
                onClick={() => handleSendEmail(notification.id)}
                className="text-blue-600 hover:text-blue-800 transition-colors text-xs"
                >
                Send Email
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )}
</div>

              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                {showForm ? "Cancel" : "New Lending"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Lendings</h3>
                <p className="text-3xl font-bold text-blue-600">{lendings.length}</p>
              </div>
              <BookOpen className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Loans</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {lendings.filter(l => !l.isReturned).length}
                </p>
              </div>
              <Calendar className="text-yellow-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Returned</h3>
                <p className="text-3xl font-bold text-green-600">
                  {lendings.filter(l => l.isReturned).length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overdue</h3>
                <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Lending" : "Create New Lending"}
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book
                  </label>
                  <select
                    value={formData.bookId}
                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a book...</option>
                    {books.map((book) => (
                      <option key={book._id} value={book._id}>
                        {book.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reader
                  </label>
                  <select
                    value={formData.readerId}
                    onChange={(e) => setFormData({ ...formData, readerId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a reader...</option>
                    {readers.map((reader) => (
                      <option key={reader._id} value={reader._id}>
                        {reader.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Active Status Toggle - Only show when editing */}
              {editingId && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active Lending
                    </span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {formData.isActive ? "Book is currently borrowed" : "Book has been returned"}
                  </span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {editingId ? "Update" : "Create"} Lending
                </button>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by book title or reader name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "returned" | "overdue")}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="returned">Returned</option>
                <option value="overdue">OverDue</option>

              </select>
            </div>
          </div>
        </div>

        {/* Lending List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Lending Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Book</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Reader</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Lend Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLendings.map((lending) => (
                  <tr key={lending._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <BookOpen className="text-blue-600" size={20} />
                        <div>
                          <span className="font-medium text-gray-900 block">{lending.bookId.title}</span>
                          <span className="text-sm text-gray-500">
                            {books.find(b => b._id === lending.bookId._id)?.author}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Users className="text-gray-600" size={20} />
                        <div>
                          <span className="text-gray-900 block">{lending.readerId.fullName}</span>
                          <span className="text-sm text-gray-500">
                            {readers.find(r => r._id === lending.readerId._id)?.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(lending.lendDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(lending.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lending)}`}>
                        {getStatusText(lending)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!lending.isReturned && (
                          <button
                            onClick={() => handleReturn(lending._id)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors duration-150"
                          >
                            <CheckCircle size={16} />
                            Return
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(lending)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors duration-150"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lending._id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors duration-150"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLendings.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No lending records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}