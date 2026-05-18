import { Link } from 'react-router-dom'
import { FaRobot, FaMapMarkerAlt, FaFileMedical, FaShieldAlt } from 'react-icons/fa'
import { useAuthStore } from '../store/authStore'

const features = [
  {
    icon: FaRobot,
    title: 'AI Health Assistant',
    description:
      'Get instant, AI-powered answers to your health questions — available 24/7, even in low-connectivity areas.',
    color: 'text-health-blue bg-blue-50',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Clinic Finder',
    description:
      'Locate the nearest clinics, hospitals, and pharmacies on an interactive map with directions.',
    color: 'text-health-teal bg-teal-50',
  },
  {
    icon: FaFileMedical,
    title: 'Health Records',
    description:
      'Securely store and access your personal health records, medications, and medical history.',
    color: 'text-health-green bg-green-50',
  },
  {
    icon: FaShieldAlt,
    title: 'Secure & Private',
    description:
      'Your data is encrypted and protected. We follow healthcare data privacy best practices.',
    color: 'text-health-amber bg-amber-50',
  },
]

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-health-teal px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
            Healthcare for Everyone
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Rural Health Companion
            <span className="block text-primary-200">AI Lite</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-100 sm:text-xl">
            Bridging the healthcare gap for rural communities with AI-powered guidance, clinic
            discovery, and personal health management — all in one place.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 text-base px-6 py-3">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 text-base px-6 py-3">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary border-white/40 bg-transparent text-white hover:bg-white/10 text-base px-6 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need</h2>
            <p className="mt-3 text-gray-500">
              Designed specifically for rural communities with limited healthcare access.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="card hover:shadow-md transition-shadow">
                <div className={`mb-4 inline-flex rounded-xl p-3 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="bg-primary-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Ready to take control of your health?
            </h2>
            <p className="mt-3 text-gray-600">
              Join thousands of rural community members already using RHC AI Lite.
            </p>
            <Link to="/register" className="btn-primary mt-8 inline-flex text-base px-8 py-3">
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
