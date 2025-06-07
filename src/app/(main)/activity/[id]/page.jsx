'use client'

import { fetchActivityById } from '@/services/user/activity'
import { addToCart } from '@/services/user/cart'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

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
        console.error('Failed to fetch activity', error)
      } finally {
        setLoading(false)
      }
    }

    // Ambil token dari localStorage dan simpan di state
    const storedToken = Cookies.get('token')
    if (storedToken) {
      setToken(storedToken)
    }

    getActivity()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!token) {
      alert('Kamu harus login terlebih dahulu.')
      return
    }

    try {
      const response = await addToCart(activity.id, token)
      alert('Item berhasil ditambahkan ke keranjang!')
      console.log(response);
    } catch {
      alert('Gagal menambahkan ke keranjang.')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!activity) return <div className="p-4 text-red-500">Activity not found.</div>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">{activity.name}</h1>
      <p className="mb-4">{activity.description}</p>
      <img
        src={activity.imageUrls?.[0]}
        alt={activity.name}
        className="w-full max-w-md rounded"
      />
      <button
        onClick={handleAddToCart}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add to cart
      </button>
    </div>
  )
}

export default ActivityDetail
