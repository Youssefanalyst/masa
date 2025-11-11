import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../contexts/AdminContext'
import { restaurantName } from '../../data/menu'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (login(password)) {
      navigate('/admin/dashboard')
    } else {
      setError('كلمة المرور غير صحيحة')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-primary mb-2">
              لوحة التحكم
            </h1>
            <p className="text-gray-600">{restaurantName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              دخول
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>كلمة المرور الافتراضية: <code className="bg-gray-100 px-2 py-1 rounded">masa2025</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
