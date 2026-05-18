import { Outlet, Link } from 'react-router-dom'
import { FaHeartbeat } from 'react-icons/fa'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-health-teal/10 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-700">
            <FaHeartbeat className="h-8 w-8" />
            <span className="text-xl font-bold">RHC AI Lite</span>
          </Link>
          <p className="mt-1 text-sm text-gray-500">Rural Health Companion</p>
        </div>

        {/* Card */}
        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
