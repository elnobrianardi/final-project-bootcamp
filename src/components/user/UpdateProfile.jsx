'use client'

import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { fetchLoggedUser, updateProfile } from '@/services/user/user'
import { uploadImage } from '@/services/user/uploadImage'
import { toast } from 'react-toastify'

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
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const t = Cookies.get('token')
    if (t) setToken(t)
  }, [])

  useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        const user = await fetchLoggedUser(token)
        setFormData({
          name: user.name || '',
          email: user.email || '',
          profilePictureUrl: user.profilePictureUrl || '',
          phoneNumber: user.phoneNumber || '',
        })
      } catch (err) {
        toast.error('Gagal mengambil data pengguna')
      }
    })()
  }, [token])

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleFileChange = (e) => {
    const sel = e.target.files?.[0]
    if (sel) {
      setFile(sel)
      setPreviewUrl(URL.createObjectURL(sel))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return toast.error('Token tidak ditemukan')

    try {
      let imgUrl = formData.profilePictureUrl
      if (file) imgUrl = await uploadImage(file, token)

      const update = {
        ...(formData.name && { name: formData.name }),
        ...(formData.email && { email: formData.email }),
        ...(imgUrl && { profilePictureUrl: imgUrl }),
        ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
      }

      await updateProfile(update, token)
      toast.success('Profil berhasil diperbarui')
      setShowModal(false)
    } catch (err) {
      console.error(err)
      toast.error('Gagal memperbarui profil')
    }
  }

  return (
    <>
      <div className="text-center mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer"
        >
          Edit Profil
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit Profil</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-emerald-500 focus:outline-none"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-emerald-500 focus:outline-none"
              />
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Nomor Telepon"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-emerald-500 focus:outline-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 cursor-pointer"
              />
              {(previewUrl || formData.profilePictureUrl) && (
                <img
                  src={previewUrl || formData.profilePictureUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full border mx- cursor-pointer"
                />
              )}
              <div className="flex justify-between md:justify-end gap-3 pt-2 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700  cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateProfile
