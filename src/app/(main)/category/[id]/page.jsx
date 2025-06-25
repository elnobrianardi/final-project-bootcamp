'use client'

import { useEffect, useState } from 'react'
import { fetchCategoryById } from '@/services/user/category'
import { filterByCategory } from '@/services/user/activity'
import Link from 'next/link'
import { motion } from 'framer-motion'

const fallbackImage = '/fallback-image.jpg'

const CategoryDetail = ({ params }) => {
  const [category, setCategory] = useState(null)
  const [imageSrc, setImageSrc] = useState('')
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await fetchCategoryById(params.id)
        setCategory(data)
        setImageSrc(data.imageUrl)
      } catch (error) {
        console.error('Failed to fetch category:', error)
      }
    }

    const getActivities = async () => {
      try {
        const response = await filterByCategory(params.id)
        setActivities(response)
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      }
    }

    getCategory()
    getActivities()
  }, [params.id])

  if (!category) {
    return <div className="p-4 text-red-500">Category not found.</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{category.name}</h1>

      <motion.div
        initial={{ opacity: 0.6, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl overflow-hidden shadow mb-6"
      >
        <img
          src={imageSrc}
          onError={() => setImageSrc(fallbackImage)}
          alt={category.name}
          className="w-full h-64 object-cover"
        />
      </motion.div>

      <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
        {category.description}
      </p>

      {activities.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Aktivitas Terkait</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  href={`/activity/${activity.id}`}
                  className="group block rounded-xl border border-transparent shadow-sm hover:shadow-md transition overflow-hidden bg-white"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={activity.imageUrls?.[0] || fallbackImage}
                      alt={activity.title}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = fallbackImage)}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                    <p className="mt-2 text-sm font-semibold text-emerald-700">
                      Rp {Number(activity.price || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default CategoryDetail
