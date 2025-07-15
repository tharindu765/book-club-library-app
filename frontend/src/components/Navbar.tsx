import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import axios from "axios"
import { useAuth } from "../contexts/useAuth"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedIn, logout: unauthenticate } = useAuth()

  const handleLogin = () => {
    navigate("/login")
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      alert("Logout successful!") // ← using simple alert instead of toast
      unauthenticate()
      navigate("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.message}`)
      } else {
        alert("Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDashboard = () => {
    navigate("/dashboard")
  }

  const handleReaders = () => {
  navigate("/dashboard/readers")
}


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className='bg-white shadow-lg border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo/Brand */}
          <div className='flex items-center'>
            <div className='flex-shrink-0 cursor-pointer' onClick={handleDashboard}>
              <h1 className='text-2xl font-bold text-indigo-600'>📚 Book Club</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-4'>
            {/* Common navigation links */}
            {/* Authentication-based navigation */}
            {!isLoggedIn ? (
              <button
                onClick={handleLogin}
                className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors'
              >
                Login
              </button>
            ) : (
              <>
                <button
                  onClick={handleDashboard}
                  className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Dashboard
                </button>
                  <button
                  onClick={handleReaders}
                  className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Readers
                </button>

                <button
                  disabled={isLoading}
                  onClick={handleLogout}
                  className='bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2 rounded-md'
            >
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                {isMenuOpen ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 border-t border-gray-200'>
              {/* Common navigation links for mobile */}
              {/* Authentication-based mobile navigation */}
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogin()
                    setIsMenuOpen(false)
                  }}
                  className='block w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors'
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleDashboard()
                      setIsMenuOpen(false)
                    }}
                    className='block w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors'
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleReaders()
                      setIsMenuOpen(false)
                    }}
                    className='block w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors'
                  >
                    Readers
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className='block w-full text-left bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 rounded-md text-base font-medium transition-colors'
                  >
                    {isLoading ? "Logging out..." : "Logout"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar