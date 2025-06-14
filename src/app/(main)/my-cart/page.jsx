'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCart, fetchCart, updateCart } from '@/services/user/cart'
import { createTransaction } from '@/services/user/transaction'
import Cookies from 'js-cookie'

const Cart = () => {
  const router = useRouter()
  const [carts, setCarts] = useState([])
  const [token, setToken] = useState('')

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
        console.error(error)
      }
    }

    getCarts()
  }, [token])

  const getTotal = () => {
    return carts.reduce(
      (acc, item) => acc + item.quantity * (item.activity.price ?? 0),
      0
    )
  }

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCart(cartId, token, newQuantity)
      const updatedCarts = carts.map((item) =>
        item.id === cartId ? { ...item, quantity: newQuantity } : item
      )
      setCarts(updatedCarts)
    } catch (error) {
      console.error(error)
      alert('Gagal memperbarui jumlah.')
    }
  }

  const handleDelete = async () => {
    if (carts.length === 0) return
    try {
      const cartId = carts[0].id
      await deleteCart(cartId, token)
      setCarts((prev) => prev.filter((item) => item.id !== cartId))
      alert('Item berhasil dihapus.')
    } catch (error) {
      console.error(error)
      alert('Gagal menghapus item.')
    }
  }

  const handleCheckout = async () => {
    try {
      const cartIds = carts.map((item) => item.id)
      await createTransaction(cartIds, token)
      router.push('/checkout')
    } catch (error) {
      console.error(error)
      alert('Gagal membuat transaksi.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Keranjang Saya</h1>

      {carts.length === 0 ? (
        <p className="text-gray-500">Keranjang masih kosong.</p>
      ) : (
        <div className="space-y-6">
          {carts.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center gap-4 p-4 border border-transparent shadow rounded-xl bg-white"
            >
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  className="bg-gray-200 px-3 py-1 rounded text-lg"
                >
                  −
                </button>
                <span className="min-w-[24px] text-center">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 px-3 py-1 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center border-t pt-4">
            <h3 className="text-xl font-bold text-gray-800">Total:</h3>
            <p className="text-xl font-bold text-emerald-600">
              Rp {getTotal().toLocaleString('id-ID')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleDelete}
              disabled={carts.length === 0}
              className="w-full md:w-auto bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 disabled:bg-red-300 cursor-pointer"
            >
              Hapus Item Pertama
            </button>
            <button
              onClick={handleCheckout}
              className="w-full md:w-auto bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer"
            >
              Checkout Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
