'use client'

import { fetchCart } from '@/services/user/cart'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const CartData = ({ onCartIdReady, cartIds }) => {
  const [cart, setCart] = useState([])
  const [token, setToken] = useState('')

  useEffect(() => {
    const storedToken = Cookies.get('token')
    if (storedToken) setToken(storedToken)
  }, [])

  useEffect(() => {
    if (!token) return

    const getCart = async () => {
      try {
        const data = await fetchCart(token)

        const filtered = cartIds && cartIds.length > 0
          ? data.filter((item) => cartIds.includes(item.id))
          : data

        setCart(filtered)

        if (filtered.length > 0) {
          const ids = filtered.map(item => item.id)
          onCartIdReady?.(ids)
        }
      } catch (error) {
        console.error(error)
      }
    }

    getCart()
  }, [token, cartIds]) 

  if (cart.length === 0) {
    return <p className="text-gray-600 text-center">Keranjang kosong atau belum dipilih.</p>
  }

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Item di Keranjang</h2>
      <table className="min-w-full table-auto border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-teal-50">
            <th className="px-4 py-2 text-left text-sm font-medium text-teal-800">Nama Aktivitas</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-teal-800">Harga</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-teal-800">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <td className="px-4 py-2 text-gray-800">{item.activity.title}</td>
              <td className="px-4 py-2 text-gray-700">
                Rp {(item.activity.price ?? 0).toLocaleString('id-ID')}
              </td>
              <td className="px-4 py-2 text-gray-700">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CartData
