'use client'

import { fetchCart } from '@/services/cart'
import { createTransaction } from '@/services/transaction'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Cart = () => {
  const router = useRouter()
  const [carts, setCarts] = useState([])
  const [token, setToken] = useState('')

  // Ambil token dari localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  // Fetch carts setelah token ada
  useEffect(() => {
    const getCarts = async () => {
      try {
        if (!token) return // tunggu token tersedia
        const response = await fetchCart(token)
        setCarts(response || [])
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }

    getCarts()
  }, [token]) // bergantung pada token

  // Hitung total harga cart
  const getTotal = () => {
    return carts.reduce((acc, item) => {
      return acc + item.quantity * (item.activity.price ?? 0)
    }, 0)
  }

  const handleCheckout = async () => {
    try {
      const response = await createTransaction(carts.id, token)
      console.log(response)
      router.push('/checkout')
    } catch (error) {
      console.log(error);
      alert('Gagal membuat transaksi. Silakan coba lagi.')
    }
  }

  return (
    <div>
      {carts.length === 0 ? (
        <h1>Cart is empty</h1>
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
                <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">
                  Rp {(item.quantity * (item.activity.price ?? 0)).toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
            <tr>
              <td
                colSpan={5}
                className="border border-gray-300 px-4 py-2 font-bold text-right"
              >
                Total
              </td>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                Rp {getTotal().toLocaleString('id-ID')}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  )
}

export default Cart
