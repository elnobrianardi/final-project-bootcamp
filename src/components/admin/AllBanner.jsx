'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Cookies from 'js-cookie'
import { fetchBanner } from '@/services/user/banner'
import { createBanner, updateBanner, deleteBanner } from '@/services/admin/banner'
import { uploadImage } from '@/services/user/uploadImage'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AllBanner = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', imageUrl: '', link: '', id: null })
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const token = Cookies.get('token')

  useEffect(() => {
    const getBanner = async () => {
      try {
        const response = await fetchBanner()
        setBanners(response.data || [])
      } catch (error) {
        toast.error('Failed to fetch banners')
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    getBanner()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0]
    if(!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))

    try {
      const imageUrl = await uploadImage(selected, token)
      setFormData((prev) => ({...prev, imageUrl}))
      toast.success('Image Uploaded')
    } catch (error) {
      console.log(error);
      toast.error('Failed to upload image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return toast.error('Token not found.')

    try {
      if (formData.id) {
        await updateBanner(formData.id, {
          name: formData.name,
          imageUrl: formData.imageUrl,
          link: formData.link
        }, token)
        toast.success('Banner updated!')
      } else {
        await createBanner({
          name: formData.name,
          imageUrl: formData.imageUrl,
          link: formData.link
        }, token)
        toast.success('Banner created!')
      }

      setShowForm(false)
      setFormData({ name: '', imageUrl: '', link: '', id: null })
      const response = await fetchBanner()
      setBanners(response.data || [])
    } catch (error) {
      toast.error('Failed to save banner')
    }
  }

  const handleEdit = (banner) => {
    setFormData({
      id: banner.id,
      name: banner.name,
      imageUrl: banner.imageUrl,
      link: banner.link
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!token) return toast.error('Token not found.')
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      await deleteBanner(id, token)
      setBanners(banners.filter((banner) => banner.id !== id))
      toast.success('Banner deleted!')
    } catch (error) {
      toast.error('Failed to delete banner')
    }
  }

  const { currentItems, totalPages, pageNumbers, indexOfFirstItem } = useMemo(() => {
    const totalItems = banners.length
    const total = Math.ceil(totalItems / itemsPerPage)
    const calculatedIndexOfLastItem = currentPage * itemsPerPage
    const calculatedIndexOfFirstItem = calculatedIndexOfLastItem - itemsPerPage
    const slicedItems = banners.slice(calculatedIndexOfFirstItem, calculatedIndexOfLastItem)

    const numbers = []
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(total, currentPage + 2)

    if (endPage - startPage + 1 < 5) {
      if (currentPage - startPage < 2) endPage = Math.min(total, startPage + 4)
      else startPage = Math.max(1, endPage - 4)
    }

    while (endPage - startPage + 1 < 5 && endPage < total) endPage++
    while (endPage - startPage + 1 < 5 && startPage > 1) startPage--

    for (let i = startPage; i <= endPage; i++) numbers.push(i)

    return {
      currentItems: slicedItems,
      totalPages: total,
      pageNumbers: numbers,
      indexOfFirstItem: calculatedIndexOfFirstItem
    }
  }, [banners, currentPage, itemsPerPage])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (loading) {
    return <p className="text-center mt-10">Loading banners...</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Banners</h1>
      <button onClick={() => setShowForm(true)} className="mb-4 bg-green-500 text-white px-4 py-2 rounded">
        Create New Banner
      </button>

      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-10">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full max-w-md shadow-md">
            <h2 className="text-lg font-bold mb-4">{formData.id ? 'Edit Banner' : 'Create Banner'}</h2>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Title" required className="mb-2 p-2 border rounded w-full" />
            <input type="file" accept='image/*' onChange={handleFileChange} className='mb-2 w-full border p-2 rounded text-sm' />
            {previewUrl || formData.imageUrl? (
              <img src={previewUrl || formData.imageUrl} alt="preview" className='w-full h-40 object-cover rounded mb-4 border'/>
              )  : null
            }
            <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Link (optional)" className="mb-4 p-2 border rounded w-full" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                {formData.id ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">No</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((banner, index) => (
            <tr key={banner.id}>
              <td className="p-2 border">{indexOfFirstItem + index + 1}</td>
              <td className="p-2 border">{banner.name}</td>
              <td className="p-2 border">
                <img src={banner.imageUrl} alt={banner.name} className="h-12 w-auto object-cover" onError={(e) => e.currentTarget.src = '/fallback-image.jpg'} />
              </td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEdit(banner)} className="text-yellow-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300">
            Prev
          </button>
          {pageNumbers.map((page) => (
            <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}>
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300">
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default AllBanner
