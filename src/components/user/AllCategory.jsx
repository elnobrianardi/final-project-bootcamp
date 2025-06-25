'use client'

import React, { useEffect, useState } from 'react'
import { fetchCategory } from '@/services/user/category'
import Link from 'next/link'
import { motion } from 'framer-motion'

const fallbackImage = '/fallback-image.jpg'

const AllCategory = () => {
  const [categories, setCategories] = useState([])

  const getCategory = async () => {
    try {
      const response = await fetchCategory()
      setCategories(response)
    } catch (error) {
      console.error('Gagal mengambil kategori:', error)
    }
  }

  useEffect(() => {
    getCategory()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-6"
    >
      <h1 className="text-center text-3xl font-bold text-emerald-700 mb-8">
        Kategori
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {categories.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={`/category/${item.id}`}
              className="group block rounded-xl border border-transparent overflow-hidden shadow hover:shadow-md transition-all bg-white"
            >
              <div className="aspect-square overflow-hidden rounded-xl">
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default AllCategory
