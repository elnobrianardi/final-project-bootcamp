'use client'

import { useEffect, useState } from 'react'
import { fetchLoggedUser, updateProfile } from '@/services/user/user'
import { uploadImage } from '@/services/user/uploadImage'

const UpdateProfile = () => {
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)
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
    const storedToken = localStorage.getItem('token')
    if (storedToken) setToken(storedToken)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      if (!token) return
      try {
        const res = await fetchLoggedUser(token)
        setUser(res)
        setFormData({
          name: res.name || '',
          email: res.email || '',
          profilePictureUrl: res.profilePictureUrl || '',
          phoneNumber: res.phoneNumber || '',
        })
      } catch (err) {
        console.error('Gagal fetch user:', err)
      }
    }
    getUser()
  }, [token])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      const preview = URL.createObjectURL(selected)
      setPreviewUrl(preview)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      let imageUrl = formData.profilePictureUrl

      if (file) {
        console.log('Mengupload gambar...')
        imageUrl = await uploadImage(file, token)
        console.log('URL gambar:', imageUrl)
      }

      const dataToSend = {
        ...(formData.name && { name: formData.name }),
        ...(formData.email && { email: formData.email }),
        ...(imageUrl && { profilePictureUrl: imageUrl }),
        ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
      }

      console.log('Data yang dikirim ke updateProfile:', dataToSend)

      await updateProfile(dataToSend, token)
      setSuccess('Profile berhasil diperbarui.')
    } catch (err) {
      console.error('Gagal update profile:', err)
      setError('Gagal update profile.')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
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
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full border"
          />
        )}
        {!previewUrl && formData.profilePictureUrl && (
          <img
            src={formData.profilePictureUrl}
            alt="Foto saat ini"
            className="w-32 h-32 object-cover rounded-full border"
          />
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Simpan
        </button>
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  )
}

export default UpdateProfile
