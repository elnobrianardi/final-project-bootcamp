'use client'

import { fetchBanner } from '@/services/user/banner'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const Banner = () => {
  const [banners, setBanners] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const getBanner = async () => {
    try {
      const response = await fetchBanner()
      setBanners(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getBanner()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [banners])

  if (!banners.length) return null

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg">
      <div className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={`/banner/${banner.id}`}
            className="w-full flex-shrink-0"
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-64 object-cover"
            />
            <div className="text-center p-4 bg-white">
              <h2 className="text-xl font-semibold">{banner.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Banner
