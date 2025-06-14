'use client'

import { useEffect, useState } from 'react'
import { fetchActivity, filterByCategory } from '@/services/user/activity'
import Link from 'next/link'

const fallbackImage = '/fallback-image.jpg'

export default function AllActivity() {
  const [categories, setCategories] = useState([])
  const [activities, setActivities] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    const getAllActivities = async () => {
      try {
        const data = await fetchActivity()
        if (data) {
          setActivities(data)

          const uniqueCategories = data
            .map((item) => item.category)
            .filter(
              (cat, index, self) =>
                cat && index === self.findIndex((c) => c.id === cat.id)
            )
          setCategories(uniqueCategories)
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      }
    }

    getAllActivities()
  }, [])

  const handleChange = async (e) => {
    const value = e.target.value
    setSelectedCategory(value)
    setCurrentPage(1)

    try {
      const data = value === '' ? await fetchActivity() : await filterByCategory(value)
      setActivities(data)
    } catch (error) {
      console.error('Failed to filter activities:', error)
    }
  }

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = activities.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(activities.length / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <label htmlFor="category-filter" className="block mb-2 text-sm font-medium text-gray-700">
          Filter berdasarkan Kategori
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleChange}
          className="w-full md:w-1/2 rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">-- Semua Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentItems.map((item) => (
          <Link
            key={item.id}
            href={`/activity/${item.id}`}
            className="group block overflow-hidden rounded-xl border border-transparent bg-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={item.imageUrls?.[0] || fallbackImage}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage
                }}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">
                {item.city}, {item.province}
              </p>
              <p className="mt-2 text-sm font-bold text-emerald-700">
                Rp {Number(item.price_discount).toLocaleString('id-ID')}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`rounded px-4 py-2 text-sm border ${
                currentPage === num
                  ? 'bg-emerald-600 text-white'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
