'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCart, fetchCart, updateCart } from '@/services/user/cart'
import { createTransaction } from '@/services/user/transaction'
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'

const Cart = () => {
  const router = useRouter()
  const [carts, setCarts] = useState([])
  const [token, setToken] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = Cookies.get('token')
    if (storedToken) setToken(storedToken)
  }, [])

  useEffect(() => {
    const getCarts = async () => {
      if (!token) return
      try {
        const response = await fetchCart(token)
        setCarts(response || [])
      } catch (error) {
        toast.error('Gagal mengambil keranjang.')
        console.error(error)
      }
    }

    getCarts()
    setLoading(false)
  }, [token])

  const handleSelect = (cartId) => {
    setSelectedIds((prev) =>
      prev.includes(cartId) ? prev.filter((id) => id !== cartId) : [...prev, cartId]
    )
  }

  const getTotal = () => {
    return carts
      .filter((item) => selectedIds.includes(item.id))
      .reduce((acc, item) => acc + item.quantity * (item.activity.price ?? 0), 0)
  }

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCart(cartId, token, newQuantity)
      const updatedCarts = carts.map((item) =>
        item.id === cartId ? { ...item, quantity: newQuantity } : item
      )
      setCarts(updatedCarts)
      toast.success('Jumlah diperbarui.')
    } catch (error) {
      console.error(error)
      toast.error('Gagal memperbarui jumlah.')
    }
  }

  const handleDelete = async (cartId) => {
    try {
      await deleteCart(cartId, token)
      setCarts((prev) => prev.filter((item) => item.id !== cartId))
      setSelectedIds((prev) => prev.filter((id) => id !== cartId))
      toast.success('Item berhasil dihapus.')
    } catch (error) {
      console.error(error)
      toast.error('Gagal menghapus item.')
    }
  }

  const handleCheckout = async () => {
    if (selectedIds.length === 0) {
      toast.warn('Pilih setidaknya 1 item.')
      return
    }

    localStorage.setItem('selectedCartIds', JSON.stringify(selectedIds))

    try {
      await createTransaction(selectedIds, token)
      toast.success('Transaksi berhasil dibuat.')
      router.push('/checkout')
    } catch (error) {
      console.error(error)
      toast.error('Gagal membuat transaksi.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
  return (
    <div className="flex justify-center items-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="text-teal-600"
      >
        <LoaderCircle size={32} className="animate-spin" />
      </motion.div>
      <span className="ml-3 text-gray-600">Memuat data keranjang...</span>
    </div>
  )
}

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Keranjang Saya</h1>

      {carts.length === 0 ? (
        <p className="text-gray-500">Keranjang masih kosong.</p>
      ) : (
        <div className="space-y-6">
          {carts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-4 p-4 border border-transparent shadow rounded-xl bg-white"
            >
              <input
                type="checkbox"
                className="self-start md:self-center"
                checked={selectedIds.includes(item.id)}
                onChange={() => handleSelect(item.id)}
              />

              <img
                src={item.activity.imageUrls?.[0] ?? '/fallback-image.jpg'}
                alt={item.activity.title}
                className="w-full md:w-32 h-32 object-cover rounded-lg"
                onError={(e) => (e.currentTarget.src = '/fallback-image.jpg')}
              />

              <div className="flex-1 space-y-1">
                <h2 className="text-lg font-semibold text-gray-800">{item.activity.title}</h2>
                <p className="text-sm text-gray-500">
                  Harga: Rp {(item.activity.price ?? 0).toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500">
                  Diskon: Rp {(item.activity.price_discount ?? 0).toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-700 font-semibold">
                  Subtotal: Rp {(item.quantity * (item.activity.price ?? 0)).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 md:items-end">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 px-3 py-1 rounded text-lg cursor-pointer"
                  >
                    −
                  </button>
                  <span className="min-w-[24px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 px-3 py-1 rounded text-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-600 hover:underline cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          ))}

          <div className="flex justify-between items-center border-t pt-4">
            <h3 className="text-xl font-bold text-gray-800">Total:</h3>
            <p className="text-xl font-bold text-emerald-600">
              Rp {getTotal().toLocaleString('id-ID')}
            </p>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckout}
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer"
            >
              Checkout Sekarang
            </motion.button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  )
}

export default Cart
