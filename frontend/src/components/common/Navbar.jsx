import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaHeartbeat, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'
import { useAuthStore } from '../../store/authStore'
import clsx from 'clsx'

const navLinks = [
  { to: '/dashboard',      label: 'Dashboard' },
  { to: '/ai-chat',        label: 'AI Chat' },
  { to: '/clinic-finder',  label: 'Clinic Finder' },
  { to: '/health-records', label: 'Health Records' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-primary-700">
          <FaHeartbeat className="h-6 w-6" />
          <span className="font-bold text-lg leading-none">RHC AI Lite</span>
        </Link>

        {/* Desktop nav */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 text-sm text-gray-700 hover:text-primary-700"
              >
                <FaUserCircle className="h-5 w-5" />
                <span className="font-medium">{user?.full_name?.split(' ')[0] || 'Profile'}</span>
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-xs px-3 py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm px-3 py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm px-3 py-2">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          {isAuthenticated && (
            <button
              className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && menuOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Profile
          </Link>
        </nav>
      )}
    </header>
  )
}
