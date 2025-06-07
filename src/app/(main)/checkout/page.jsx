'use client'

import React, { useEffect, useState } from 'react'
import CartData from '@/components/CartData'
import PaymentOptions from '@/components/Payment'
import { createTransaction } from '@/services/user/transaction'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const CheckoutPage = () => {
  const router = useRouter()
  const [cartIds, setCartIds] = useState([])
  const [paymentId, setPaymentId] = useState(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    const storedToken = Cookies.get('token')
    if (storedToken) setToken(storedToken)
  }, [])

  const handleBooking = async () => {
    if (!cartIds || !paymentId) {
      alert('Cart atau metode pembayaran belum dipilih.')
      return
    }

    try {
      await createTransaction({ cartIds, paymentMethodId: paymentId }, token)
      alert('Booking berhasil!')
      router.push('/my-bookings')
    } catch (error) {
      console.error(error)
      alert('Booking gagal.')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      <CartData onCartIdReady={setCartIds} />
      <PaymentOptions onPaymentIdSelect={setPaymentId} />
      <button
        onClick={handleBooking}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Booking
      </button>
    </div>
  )
}

export default CheckoutPage
