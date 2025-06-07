'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { fetchLoggedUser, updateProfile } from '@/services/user/user'
import { uploadImage } from '@/services/user/uploadImage'

const UpdateProfile = () => {
  const [token, setToken] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePictureUrl: '',
    phoneNumber: '',
  })
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const cookieToken = Cookies.get('token')
    if (cookieToken) setToken(cookieToken)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return
      try {
        const user = await fetchLoggedUser(token)
        setFormData({
          name: user.name || '',
          email: user.email || '',
          profilePictureUrl: user.profilePictureUrl || '',
          phoneNumber: user.phoneNumber || '',
        })
      } catch (err) {
        console.error('Gagal fetch user:', err)
        setError('Gagal mengambil data pengguna')
      }
    }

    fetchUser()
  }, [token])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreviewUrl(URL.createObjectURL(selected))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      let imageUrl = formData.profilePictureUrl

      if (file) {
        imageUrl = await uploadImage(file, token)
      }

      const dataToSend = {
        ...(formData.name && { name: formData.name }),
        ...(formData.email && { email: formData.email }),
        ...(imageUrl && { profilePictureUrl: imageUrl }),
        ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
      }

      await updateProfile(dataToSend, token)
      setSuccess('Profil berhasil diperbarui')
    } catch (err) {
      console.error('Gagal update profile:', err)
      setError('Gagal update profile')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Update Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {(previewUrl || formData.profilePictureUrl) && (
          <img
            src={previewUrl || formData.profilePictureUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full border"
          />
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Simpan
        </button>
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  )
}

export default UpdateProfile
