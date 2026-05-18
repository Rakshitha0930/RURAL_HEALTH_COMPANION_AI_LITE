import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa'
import api from '../../lib/axios'
import { useAuthStore } from '../../store/authStore'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  })

  const registerMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/auth/register', payload)
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Registration failed. Please try again.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match.')
      return
    }
    const { confirm_password, ...payload } = form
    registerMutation.mutate(payload)
  }

  const field = (id, label, type, placeholder, icon) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          id={id}
          type={type}
          required
          placeholder={placeholder}
          className="input-field pl-10"
          value={form[id]}
          onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        />
      </div>
    </div>
  )

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-gray-900">Create account</h2>
      <p className="mb-6 text-sm text-gray-500">Join Rural Health Companion AI Lite</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {field('full_name', 'Full Name', 'text', 'Jane Doe', <FaUser className="h-4 w-4" />)}
        {field('email', 'Email Address', 'email', 'you@example.com', <FaEnvelope className="h-4 w-4" />)}
        {field('phone', 'Phone Number', 'tel', '+1 555 000 0000', <FaPhone className="h-4 w-4" />)}
        {field('password', 'Password', 'password', '••••••••', <FaLock className="h-4 w-4" />)}
        {field('confirm_password', 'Confirm Password', 'password', '••••••••', <FaLock className="h-4 w-4" />)}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="btn-primary w-full py-3"
        >
          {registerMutation.isPending ? (
            <>
              <LoadingSpinner size="sm" />
              Creating account…
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
