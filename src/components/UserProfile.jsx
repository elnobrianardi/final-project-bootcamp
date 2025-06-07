'use client'

import { fetchLoggedUser } from '@/services/user/user'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'

const UserProfile = () => {
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedToken = Cookies.get('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const getUser = async () => {
    try {
      const response = await fetchLoggedUser(token)
      console.log(response)
      setUser(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) {
      getUser()
    }
  }, [token])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">User Profile</h1>
      {user ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          {user.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border"
            />
          ) : (
            <p className="text-gray-500">No profile picture</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default UserProfile
