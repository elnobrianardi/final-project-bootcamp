'use client'

import { fetchPromo } from '@/services/user/promo'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const fallbackImage = '/fallback-image.jpg'

const AllPromo = () => {
  const [promos, setPromos] = useState([])

  const getPromo = async () => {
    try {
      const response = await fetchPromo()
      setPromos(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPromo()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-10">
        Promo Menarik Untukmu 🎉
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {promos.map((promo) => (
          <Link
            href={`/promo/${promo.id}`}
            key={promo.id}
            className="bg-gradient-to-br from-emerald-50 to-white border-2 border-transparent rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={promo.imageUrl || fallbackImage}
                alt={promo.title}
                onError={(e) => (e.currentTarget.src = fallbackImage)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-emerald-800 mb-2">{promo.title}</h2>
              <p className="text-gray-700 text-sm line-clamp-2">{promo.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AllPromo
