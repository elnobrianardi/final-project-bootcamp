'use client'

import React, { useEffect, useState } from 'react'
import { fetchCategory } from '../../services/user/category'
import Link from 'next/link'

const fallbackImage = '/fallback-image.jpg'

const AllCategory = () => {
  const [categories, setCategories] = useState([])

  const getCategory = async () => {
    try {
      const response = await fetchCategory()
      setCategories(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCategory()
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-center text-3xl font-bold text-emerald-700 mb-8">Kategori</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/category/${item.id}`}
            className="group block rounded-xl border border-transparent overflow-hidden shadow hover:shadow-md transition-all"
          >
            <div className="aspect-square overflow-hidden bg-white rounded-xl">
              <img
                src={item.imageUrl || fallbackImage}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage
                }}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3 text-center">
              <h2 className="text-base font-semibold text-gray-800 group-hover:text-emerald-600 transition">
                {item.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AllCategory
