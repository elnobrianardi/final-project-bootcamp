'use client'

import { createCategory, deleteCategory, updateCategory } from '@/services/admin/category'
import { fetchCategory } from '@/services/user/category'
import { uploadImage } from '@/services/user/uploadImage'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AllCategory = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', imageUrl: '', id: null })
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const token = Cookies.get('token')

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await fetchCategory()
        setCategories(response || [])
      } catch (error) {
        toast.error('Failed to fetch categories')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    getCategory()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))

    try {
      const imageUrl = await uploadImage(selected, token)
      setFormData((prev) => ({ ...prev, imageUrl }))
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Failed to upload image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return toast.error('Token not found')

    try {
      if (formData.id) {
        await updateCategory(formData.id, {
          name: formData.name,
          imageUrl: formData.imageUrl
        }, token)
        toast.success('Category updated!')
      } else {
        await createCategory({
          name: formData.name,
          imageUrl: formData.imageUrl
        }, token)
        toast.success('Category created!')
      }

      setFormData({ name: '', imageUrl: '', id: null })
      setPreviewUrl('')
      setShowForm(false)
      const refreshed = await fetchCategory()
      setCategories(refreshed || [])
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  const handleEdit = (cat) => {
    setFormData({
      id: cat.id,
      name: cat.name,
      imageUrl: cat.imageUrl,
    })
    setPreviewUrl(cat.imageUrl)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!token) return toast.error('Token not found')
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await deleteCategory(id, token)
      setCategories(categories.filter((cat) => cat.id !== id))
      toast.success('Category deleted!')
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const { currentItems, totalPages, pageNumbers, indexOfFirstItem } = useMemo(() => {
    const total = Math.ceil(categories.length / itemsPerPage)
    const start = (currentPage - 1) * itemsPerPage
    const sliced = categories.slice(start, start + itemsPerPage)
    const numbers = Array.from({ length: total }, (_, i) => i + 1)
    return {
      currentItems: sliced,
      totalPages: total,
      pageNumbers: numbers,
      indexOfFirstItem: start
    }
  }, [categories, currentPage])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (loading) return <p className="text-center mt-10">Loading categories...</p>

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>All Categories</h1>

      <button onClick={() => {
        setFormData({ name: '', imageUrl: '', id: null })
        setPreviewUrl('')
        setShowForm(true)
      }} className='mb-4 bg-green-500 text-white px-4 py-2 rounded'>
        Create New Category
      </button>

      {/* FORM POPUP */}
      {showForm && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{formData.id ? 'Edit Category' : 'Create Category'}</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full border mb-3 p-2 rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border mb-3 p-2 rounded text-sm"
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded mb-4 border" />
            )}
            <div className="flex justify-end gap-2 pb-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded bg-gray-400 text-white">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
                {formData.id ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <table className='w-full border text-sm'>
        <thead className='bg-gray-200'>
          <tr>
            <th className='p-2 border'>No</th>
            <th className='p-2 border'>Name</th>
            <th className='p-2 border'>Image</th>
            <th className='p-2 border'>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((cat, index) => (
            <tr key={cat.id}>
              <td className='border p-2'>{indexOfFirstItem + index + 1}</td>
              <td className='p-2 border'>{cat.name}</td>
              <td className='p-2 border'>
                <img src={cat.imageUrl} alt={cat.name} className='w-16 h-16 object-cover' onError={(e) => e.currentTarget.src = '/fallback-image.jpg'} />
              </td>
              <td className='p-2 border space-x-2'>
                <button onClick={() => handleEdit(cat)} className='text-yellow-600 hover:underline'>Edit</button>
                <button onClick={() => handleDelete(cat.id)} className='text-red-600 hover:underline'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className='flex justify-center gap-2 mt-6'>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300'>
            Prev
          </button>
          {pageNumbers.map((page) => (
            <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}>
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300'>
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default AllCategory
