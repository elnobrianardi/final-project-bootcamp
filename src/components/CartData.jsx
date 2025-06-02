'use client'

import { fetchCart } from '@/services/user/cart'
import { useEffect, useState } from 'react'

const CartData = ({ onCartIdReady }) => {
  const [cart, setCart] = useState([])
  const [token, setToken] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    const getCart = async () => {
      try {
        const data = await fetchCart(token)
        setCart(data)

        // ✅ pastikan array of cart IDs
        if (data.length > 0) {
          const cartIds = data.map(item => item.id)
          onCartIdReady(cartIds)
        }
      } catch (error) {
        console.error(error)
      }
    }

    getCart()
  }, [token])

  if (cart.length === 0) return <h1>Cart is empty</h1>

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          <th className="border px-4 py-2">Nama Aktivitas</th>
          <th className="border px-4 py-2">Harga</th>
          <th className="border px-4 py-2">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item) => (
          <tr key={item.id}>
            <td className="border px-4 py-2">{item.activity.title}</td>
            <td className="border px-4 py-2">
              Rp {(item.activity.price ?? 0).toLocaleString('id-ID')}
            </td>
            <td className="border px-4 py-2">{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CartData
