'use client'

import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { fetchLoggedUser } from '@/services/user/user'

const UserProfile = () => {
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = Cookies.get('token')
    if (t) setToken(t)
  }, [])

  useEffect(() => {
    if (!token) return
    ;(async () => {
      setLoading(true)
      try {
        const user = await fetchLoggedUser(token)
        setUser(user)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>
  if (!user) return <p className="p-4 text-red-500">Data user tidak tersedia.</p>

  return (
    <div className="bg-white shadow rounded-xl p-6 w-full max-w-md text-center space-y-4">
      <img
        src={user.profilePictureUrl || '/fallback-profile.png'}
        onError={(e) => (e.currentTarget.src = '/fallback-profile.png')}
        alt="Foto Profil"
        className="w-28 h-28 mx-auto rounded-full object-cover border shadow"
      />
      <div>
        <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-sm text-emerald-600 capitalize">{user.role}</p>
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        <p><span className="font-medium text-gray-600">Email:</span> {user.email}</p>
        <p><span className="font-medium text-gray-600">Telepon:</span> {user.phoneNumber || '-'}</p>
      </div>
    </div>
  )
}

export default UserProfile
