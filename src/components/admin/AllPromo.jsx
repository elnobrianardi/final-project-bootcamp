'use client'

import { createPromo, deletePromo, updatePromo } from '@/services/admin/promo'
import { fetchPromo } from '@/services/user/promo'
import { uploadImage } from '@/services/user/uploadImage'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AllPromo = () => {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    terms_condition: '',
    promo_code: '',
    promo_discount_price: 0,
    minimum_claim_price: 0,
    id: null,
  })
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const token = Cookies.get('token')

  useEffect(() => {
    const getPromo = async () => {
      try {
        const response = await fetchPromo()
        setPromos(response.data || [])
      } catch (error) {
        toast.error('Failed to fetch promos')
        setPromos([])
      } finally {
        setLoading(false)
      }
    }

    getPromo()
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
      const url = await uploadImage(selected, token)
      setFormData((prev) => ({ ...prev, imageUrl: url }))
      toast.success('Image uploaded!')
    } catch (error) {
      toast.error('Failed to upload image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return toast.error('Token not found.')

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        terms_condition: formData.terms_condition,
        promo_code: formData.promo_code,
        promo_discount_price: Number(formData.promo_discount_price),
        minimum_claim_price: Number(formData.minimum_claim_price),
      }

      if (formData.id) {
        await updatePromo(formData.id, payload, token)
        toast.success('Promo updated!')
      } else {
        await createPromo(payload, token)
        toast.success('Promo created!')
      }

      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        terms_condition: '',
        promo_code: '',
        promo_discount_price: 0,
        minimum_claim_price: 0,
        id: null,
      })
      setPreviewUrl('')
      setFile(null)
      setShowForm(false)

      const response = await fetchPromo()
      setPromos(response.data || [])
    } catch (error) {
      toast.error('Failed to save promo')
    }
  }

  const handleEdit = (promo) => {
    setFormData({ ...promo })
    setPreviewUrl(promo.imageUrl || '')
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!token) return toast.error('Token not found')
    if (!confirm('Are you sure you want to delete this promo?')) return

    try {
      await deletePromo(id, token)
      setPromos(promos.filter((promo) => promo.id !== id))
      toast.success('Promo deleted!')
    } catch (error) {
      toast.error('Failed to delete promo')
    }
  }

  const { currentItems, totalPages, pageNumbers, indexofFirstItem } = useMemo(() => {
    const totalItems = promos.length
    const total = Math.ceil(totalItems / itemsPerPage)
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const sliced = promos.slice(firstIndex, lastIndex)

    const numbers = []
    for (let i = 1; i <= total; i++) numbers.push(i)

    return {
      currentItems: sliced,
      totalPages: total,
      pageNumbers: numbers,
      indexofFirstItem: firstIndex,
    }
  }, [promos, currentPage])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (loading) return <p className="text-center mt-10">Loading promos...</p>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Promos</h1>

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Create New Promo
      </button>

      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-full max-w-lg shadow-md"
          >
            <h2 className="text-lg font-bold mb-4">
              {formData.id ? 'Edit Promo' : 'Create Promo'}
            </h2>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder='Title' required className='p-2 mb-2 border rounded w-full'/>
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder='Description' required className='p-2 mb-2 border rounded w-full'/>
            <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 mb-2 border rounded w-full text-sm" />
            {previewUrl && (
              <img src={previewUrl} alt="preview" className="w-full h-40 object-cover rounded mb-4 border" />
            )}
            <input type="text" name="terms_condition" value={formData.terms_condition} onChange={handleChange} placeholder='Terms and Conditions' required className='p-2 mb-2 border rounded w-full'/>
            <input type="text" name="promo_code" value={formData.promo_code} onChange={handleChange} placeholder='Promo Code' required className='p-2 mb-2 border rounded w-full'/>
            <input type="number" name="promo_discount_price" value={formData.promo_discount_price === 0 ? '' : formData.promo_discount_price} onChange={handleChange} placeholder='Promo Discount Price' required className='p-2 mb-2 border rounded w-full'/>
            <input type="number" name="minimum_claim_price" value={formData.minimum_claim_price === 0 ? '' : formData.minimum_claim_price} onChange={handleChange} placeholder='Minimum Claim Price (optional)' className='p-2 mb-4 border rounded w-full'/>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-400 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
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
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Terms</th>
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Discount</th>
            <th className="p-2 border">Min Claim</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((promo, index) => (
            <tr key={promo.id}>
              <td className="p-2 border">{indexofFirstItem + index + 1}</td>
              <td className="p-2 border">{promo.title}</td>
              <td className="p-2 border">{promo.description}</td>
              <td className="p-2 border">
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  onError={(e) => (e.currentTarget.src = '/fallback-image.jpg')}
                  className="w-20 h-12 object-cover"
                />
              </td>
              <td className="p-2 border">{promo.terms_condition}</td>
              <td className="p-2 border">{promo.promo_code}</td>
              <td className="p-2 border">{promo.promo_discount_price}</td>
              <td className="p-2 border">{promo.minimum_claim_price}</td>
              <td className="p-2 border space-y-1">
                <button onClick={() => handleEdit(promo)} className="text-yellow-600 hover:underline">Edit</button><br/>
                <button onClick={() => handleDelete(promo.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Prev
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default AllPromo
