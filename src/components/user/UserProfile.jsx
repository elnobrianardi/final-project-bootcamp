'use client'

import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { fetchLoggedUser } from '@/services/user/user'

const UserProfile = () => {
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = Cookies.get('token')
    if (storedToken) setToken(storedToken)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      if (!token) return
      setLoading(true)
      try {
        const response = await fetchLoggedUser(token)
        setUser(response)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [token])

  if (loading) {
    return <p className="p-4 text-gray-500">Loading...</p>
  }

  if (!user) {
    return <p className="p-4 text-red-500">Data user tidak tersedia.</p>
  }

  return (
    <div className="bg-white border border-transparent shadow rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Informasi Pengguna</h2>
      <div className="flex items-center gap-4">
        <img
          src={user.profilePictureUrl || '/fallback-profile.png'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
          onError={(e) => (e.currentTarget.src = '/fallback-profile.png')}
        />
        <div className="space-y-1 text-sm text-gray-700">
          <p><strong>Nama:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telepon:</strong> {user.phoneNumber}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
