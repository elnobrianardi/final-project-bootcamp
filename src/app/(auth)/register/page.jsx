'use client'

import { register } from '@/services/user/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [role, setRole] = useState('')
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleFileChange = (e) => {
    const fileList = e.target.files
    if (fileList && fileList.length > 0) {
      const file = fileList[0]
      setProfilePictureFile(file)
      const url = URL.createObjectURL(file)
      setProfilePictureUrl(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await register({
        email,
        name,
        password,
        passwordRepeat,
        role,
        profilePictureUrl,
        phoneNumber,
      })
      router.push('/login')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mt-16 mx-auto p-8 bg-white shadow-lg rounded-xl space-y-5"
    >
      <h2 className="text-3xl font-bold text-center text-teal-700">Register</h2>

      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />

      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />

      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        required
      />

      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
        placeholder="Repeat Password"
        type="password"
        required
      />

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="user"
            checked={role === 'user'}
            onChange={(e) => setRole(e.target.value)}
          />
          User
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="admin"
            checked={role === 'admin'}
            onChange={(e) => setRole(e.target.value)}
          />
          Admin
        </label>
      </div>

      <input
        className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {profilePictureUrl && (
        <p className="text-sm text-gray-600">
          Image selected: {profilePictureFile?.name}
        </p>
      )}

      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        type="number"
        required
      />

      <p className="text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-teal-600 hover:underline">
          Login
        </Link>
      </p>

      <button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md transition cursor-pointer"
      >
        Register
      </button>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
    </form>
  )
}

export default Register
