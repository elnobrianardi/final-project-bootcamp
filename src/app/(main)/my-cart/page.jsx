'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCart, fetchCart, updateCart } from '@/services/user/cart'
import { createTransaction } from '@/services/user/transaction'

const Cart = () => {
  const router = useRouter()
  const [carts, setCarts] = useState([])
  const [token, setToken] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    const getCarts = async () => {
      if (!token) return
      try {
        const response = await fetchCart(token)
        setCarts(response || [])
      } catch (error) {
        console.log(error)
      }
    }

    getCarts()
  }, [token, carts])

  const getTotal = () => {
    return carts.reduce((acc, item) => {
      return acc + item.quantity * (item.activity.price ?? 0)
    }, 0)
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
      console.log(error)
      alert('Gagal memperbarui jumlah.')
    }
  }

  const handleDelete = async () => {
    try {
      const cartId = carts[0].id
      const response = await deleteCart(cartId, token)
      return response
    } catch (error) {
      console.log(error);
    }
  }

  const handleCheckout = async () => {
    try {
      const cartIds = carts.map((item) => item.id)
      const response = await createTransaction(cartIds, token)
      console.log(response)
      router.push('/checkout')
    } catch (error) {
      console.log(error)
      alert('Gagal membuat transaksi. Silakan coba lagi.')
    }
  }

  return (
    <div className="p-4">
      {carts.length === 0 ? (
        <h1 className="text-xl font-semibold">Cart is empty</h1>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nama Aktivitas</th>
              <th className="border border-gray-300 px-4 py-2">Gambar</th>
              <th className="border border-gray-300 px-4 py-2">Harga</th>
              <th className="border border-gray-300 px-4 py-2">Diskon</th>
              <th className="border border-gray-300 px-4 py-2">Jumlah</th>
              <th className="border border-gray-300 px-4 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.activity.title}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={item.activity.imageUrls?.[0] ?? ''}
                    alt={item.activity.title}
                    className="w-20 h-20 object-cover"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Rp {(item.activity.price ?? 0).toLocaleString('id-ID')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Rp {(item.activity.price_discount ?? 0).toLocaleString('id-ID')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Rp {(item.quantity * (item.activity.price ?? 0)).toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={5} className="border border-gray-300 px-4 py-2 font-bold text-right">
                Total
              </td>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                Rp {getTotal().toLocaleString('id-ID')}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <button className='bg-red-500 py-2 px-5 rounded-lg text-white' onClick={handleDelete}>Delete Cart</button>

      {carts.length > 0 && (
        <button
          onClick={handleCheckout}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Checkout
        </button>
      )}
    </div>
  )
}

export default Cart
