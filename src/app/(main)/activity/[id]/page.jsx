'use client'

import { useEffect, useState } from 'react'
import { fetchActivityById } from '@/services/user/activity'
import { addToCart } from '@/services/user/cart'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'

const fallbackImage = '/fallback-image.jpg'

const ActivityDetail = ({ params }) => {
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  useEffect(() => {
    const getActivity = async () => {
      try {
        const data = await fetchActivityById(params.id)
        setActivity(data)
      } catch (error) {
        toast.error('Gagal memuat aktivitas.')
      } finally {
        setLoading(false)
      }
    }

    const storedToken = Cookies.get('token')
    if (storedToken) setToken(storedToken)

    getActivity()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Kamu harus login terlebih dahulu.')
      return
    }

    try {
      await addToCart(activity.id, token)
      toast.success('Berhasil ditambahkan ke keranjang!')
    } catch (error) {
      console.error('Add to cart failed:', error)
      toast.error('Gagal menambahkan ke keranjang.')
    }
  }

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading...</div>
  if (!activity)
    return (
      <div className="p-6 text-center text-red-500">Activity not found.</div>
    )

  return (
    <motion.div
      className="max-w-5xl mx-auto p-6 space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-center text-gray-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {activity.title}
      </motion.h1>

      <motion.div
        className="overflow-hidden rounded-xl shadow border border-transparent group"
        whileHover={{ scale: 1.01 }}
      >
        <img
          src={activity.imageUrls?.[0] || fallbackImage}
          alt={activity.title}
          onError={(e) => (e.currentTarget.src = fallbackImage)}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </motion.div>

      <motion.div
        className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-gray-700 leading-relaxed">{activity.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
          <p>
            <span className="font-semibold">Harga:</span>{' '}
            <span className="line-through text-red-500">
              Rp {Number(activity.price || 0).toLocaleString('id-ID')}
            </span>
          </p>
          <p>
            <span className="font-semibold">Diskon:</span>{' '}
            <span className="text-emerald-600 font-bold">
              Rp {Number(activity.price_discount || 0).toLocaleString('id-ID')}
            </span>
          </p>
          <p>
            <span className="font-semibold">Rating:</span> {activity.rating} ⭐ (
            {activity.total_reviews} ulasan)
          </p>
          <p>
            <span className="font-semibold">Fasilitas:</span>{' '}
            {activity.facilities}
          </p>
          <p className="sm:col-span-2">
            <span className="font-semibold">Alamat:</span> {activity.address},{' '}
            {activity.city}, {activity.province}
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-full rounded-xl overflow-hidden shadow border border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div
          className="w-full h-[400px] [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: activity.location_maps }}
        />
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleAddToCart}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow hover:bg-emerald-700 transition cursor-pointer"
        >
          Tambahkan ke Keranjang
        </button>
      </motion.div>
    </motion.div>
  )
}

export default ActivityDetail
