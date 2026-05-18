import { Link } from 'react-router-dom'
import { FaRobot, FaMapMarkerAlt, FaFileMedical, FaUserCircle } from 'react-icons/fa'
import { useAuthStore } from '../store/authStore'

const quickActions = [
  {
    to: '/ai-chat',
    icon: FaRobot,
    label: 'Ask AI Assistant',
    description: 'Get instant health guidance',
    color: 'bg-blue-50 text-health-blue',
    border: 'hover:border-blue-200',
  },
  {
    to: '/clinic-finder',
    icon: FaMapMarkerAlt,
    label: 'Find a Clinic',
    description: 'Locate nearby healthcare',
    color: 'bg-teal-50 text-health-teal',
    border: 'hover:border-teal-200',
  },
  {
    to: '/health-records',
    icon: FaFileMedical,
    label: 'Health Records',
    description: 'View your medical history',
    color: 'bg-green-50 text-health-green',
    border: 'hover:border-green-200',
  },
  {
    to: '/profile',
    icon: FaUserCircle,
    label: 'My Profile',
    description: 'Manage your account',
    color: 'bg-amber-50 text-health-amber',
    border: 'hover:border-amber-200',
  },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {greeting}, {user?.full_name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="mt-1 text-gray-500">How can we help you today?</p>
      </div>

      {/* Health tip banner */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-primary-600 to-health-teal p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-200">
          Daily Health Tip
        </p>
        <p className="mt-1 text-lg font-medium">
          Staying hydrated improves energy levels and brain function. Aim for 8 glasses of water
          daily.
        </p>
      </div>

      {/* Quick actions */}
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map(({ to, icon: Icon, label, description, color, border }) => (
          <Link
            key={to}
            to={to}
            className={`card flex flex-col gap-3 border border-transparent transition-all hover:shadow-md ${border}`}
          >
            <div className={`inline-flex w-fit rounded-xl p-3 ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{label}</p>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs text-amber-800">
          <strong>Medical Disclaimer:</strong> This application provides general health information
          only and is not a substitute for professional medical advice, diagnosis, or treatment.
          Always seek the advice of your physician or other qualified health provider.
        </p>
      </div>
    </div>
  )
}
