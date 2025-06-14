import UpdateProfile from '@/components/user/UpdateProfile'
import UserProfile from '@/components/user/UserProfile'
import React from 'react'

const ProfilePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Profil Saya</h1>
      <div className="flex items-center justify-center">
        <UpdateProfile />
      </div>
    </div>
  )
}

export default ProfilePage
