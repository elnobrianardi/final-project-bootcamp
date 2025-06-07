'use client'

import { register } from '@/services/user/auth'
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
      const data = await register({
        email,
        name,
        password,
        passwordRepeat,
        role,
        profilePictureUrl,
        phoneNumber,
      })
      router.push('login')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow rounded-md space-y-4"
    >
      <h2 className="text-2xl font-bold mb-2 text-center">Register</h2>

      <input
        className="w-full p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
      />
      <input
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <input
        className="w-full p-2 border rounded"
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
        placeholder="Repeat Password"
        type="password"
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="user"
            checked={role === 'user'}
            onChange={(e) => setRole(e.target.value)}
          />
          User
        </label>
        <label className="flex items-center gap-2">
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
        className="w-full p-2 border rounded"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {profilePictureUrl && (
        <div className="text-sm text-gray-600">
          Image selected: {profilePictureFile?.name}
        </div>
      )}

      <input
        className="w-full p-2 border rounded"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        type="number"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Register
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  )
}

export default Register
