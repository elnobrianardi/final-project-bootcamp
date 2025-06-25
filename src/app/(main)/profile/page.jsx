'use client'

import React from 'react'
import UserProfile from '@/components/user/UserProfile'
import UpdateProfile from '@/components/user/UpdateProfile'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'

const ProfilePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-10 space-y-8"
    >
      <h1 className="text-3xl font-bold text-emerald-700 text-center">Profil Saya</h1>

      <div className="space-y-6">
        <div className="flex justify-center">
          <UserProfile />
        </div>

        <div className="flex justify-center">
          <UpdateProfile />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  )
}

export default ProfilePage
