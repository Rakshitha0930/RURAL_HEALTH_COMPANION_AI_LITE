import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaUserCircle, FaSave } from 'react-icons/fa'
import api from '../lib/axios'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    date_of_birth: user?.date_of_birth || '',
    blood_group: user?.blood_group || '',
    allergies: user?.allergies || '',
    emergency_contact: user?.emergency_contact || '',
  })

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.put('/users/me', payload)
      return data
    },
    onSuccess: (data) => {
      updateUser(data)
      toast.success('Profile updated successfully.')
    },
    onError: () => toast.error('Failed to update profile.'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(form)
  }

  const inputRow = (id, label, type = 'text', placeholder = '') => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="input-field"
        placeholder={placeholder}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
      />
    </div>
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-full bg-primary-100 p-4 text-primary-600">
          <FaUserCircle className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.full_name}</h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {inputRow('full_name', 'Full Name', 'text', 'Jane Doe')}
          {inputRow('phone', 'Phone Number', 'tel', '+1 555 000 0000')}
          {inputRow('date_of_birth', 'Date of Birth', 'date')}
          <div>
            <label htmlFor="blood_group" className="mb-1.5 block text-sm font-medium text-gray-700">
              Blood Group
            </label>
            <select
              id="blood_group"
              className="input-field"
              value={form.blood_group}
              onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
            >
              <option value="">Select…</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="allergies" className="mb-1.5 block text-sm font-medium text-gray-700">
            Known Allergies
          </label>
          <textarea
            id="allergies"
            rows={2}
            className="input-field resize-none"
            placeholder="e.g. Penicillin, Peanuts"
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
          />
        </div>

        {inputRow('emergency_contact', 'Emergency Contact', 'text', 'Name – Phone number')}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary gap-2">
            {updateMutation.isPending ? <LoadingSpinner size="sm" /> : <FaSave className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
