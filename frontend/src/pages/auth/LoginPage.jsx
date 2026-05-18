import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import api from '../../lib/axios'
import { useAuthStore } from '../../store/authStore'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      // FastAPI OAuth2 expects form data
      const params = new URLSearchParams()
      params.append('username', credentials.email)
      params.append('password', credentials.password)
      const { data } = await api.post('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token)
      toast.success(`Welcome back, ${data.user.full_name}!`)
      navigate(from, { replace: true })
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Login failed. Please try again.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate(form)
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-gray-900">Welcome back</h2>
      <p className="mb-6 text-sm text-gray-500">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="input-field pl-10"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="input-field pl-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="btn-primary w-full py-3"
        >
          {loginMutation.isPending ? (
            <>
              <LoadingSpinner size="sm" />
              Signing in…
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Create one
        </Link>
      </p>
    </div>
  )
}
