"use client"

import { useEffect, useState } from "react"
import { fetchActivity, filterByCategory } from "@/services/activity"
import Link from "next/link"

export default function CategoryFilter() {
  const [categories, setCategories] = useState([])
  const [activities, setActivities] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [token, setToken] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
  }, [])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    const getAll = async () => {
      const data = await fetchActivity()
      if (data) {
        setActivities(data)

        const unique = data
          .map((item) => item.category)
          .filter(
            (cat, index, self) =>
              cat && index === self.findIndex((c) => c.id === cat.id)
          )

        setCategories(unique)
      }
    }

    getAll()
  }, [])

  const handleChange = async (e) => {
    const value = e.target.value
    setSelectedCategory(value)
    setCurrentPage(1)

    if (value === "") {
      const all = await fetchActivity()
      setActivities(all)
    } else {
      const filtered = await filterByCategory(value)
      setActivities(filtered)
    }
  }

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = activities.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(activities.length / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <div className="p-4">
      <label className="block mb-2 font-medium">Filter by Category</label>
      <select
        value={selectedCategory}
        onChange={handleChange}
        className="border rounded px-3 py-2 mb-6 w-full"
      >
        <option value="">-- Semua Kategori --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="grid gap-4 md:grid-cols-2">
        {currentItems.map((item) => (
          <Link href={`/activity/${item.id}`} key={item.id} className="border p-4 rounded shadow-sm">
            <img
              src={item.imageUrls?.[0]}
              alt={item.title}
              className="h-40 w-full object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-lg">{item.title}</h2>
            <p className="text-sm text-gray-600">
              {item.city}, {item.province}
            </p>
            <p className="text-sm mt-1">Rp {item.price_discount}</p>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-3 py-1 border rounded ${
              currentPage === num ? "bg-blue-500 text-white" : ""
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
