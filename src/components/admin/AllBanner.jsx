'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Cookies from 'js-cookie'
import { fetchBanner } from '@/services/user/banner'
import { createBanner, updateBanner, deleteBanner } from '@/services/admin/banner'

const AllBanner = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', imageUrl: '', link: '', id: null })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const token = Cookies.get('token')

  useEffect(() => {
    const getBanner = async () => {
      try {
        const response = await fetchBanner()
        setBanners(response.data || [])
      } catch (error) {
        console.log('Error fetching banners:', error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return alert('Token not found.')

    try {
      if (formData.id) {
        await updateBanner(formData.id, {
          name: formData.name,
          imageUrl: formData.imageUrl,
          link: formData.link
        }, token)
      } else {
        await createBanner({
          name: formData.name,
          imageUrl: formData.imageUrl,
          link: formData.link
        }, token)
      }
      location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (banner) => {
    setFormData({
      id: banner.id,
      name: banner.name,
      imageUrl: banner.imageUrl,
      link: banner.link
    })
  }

  const handleDelete = async (id) => {
    if (!token) return alert('Token not found.')
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      await deleteBanner(id, token)
      setBanners(banners.filter((banner) => banner.id !== id))
    } catch (error) {
      console.log(error)
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

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Title" required className="p-2 mr-2 mb-2 border rounded w-full" />
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required className="p-2 mr-2 mb-2 border rounded w-full" />
        <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Link (optional)" className="p-2 mr-2 mb-2 border rounded w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {formData.id ? 'Update' : 'Create'}
        </button>
      </form>

      {/* TABLE */}
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
                {banner.imageUrl ? <img src={banner.imageUrl} alt={banner.name} className="h-10 w-auto" /> : '-'}
              </td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEdit(banner)} className="text-yellow-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300">Prev</button>
          {pageNumbers.map(page => (
            <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}>
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300">Next</button>
        </div>
      )}
    </div>
  )
}

export default AllBanner
