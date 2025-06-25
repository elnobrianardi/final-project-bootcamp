'use client'

import React, { useEffect, useState } from 'react'
import CartData from '@/components/user/CartData'
import PaymentOptions from '@/components/user/Payment'
import { createTransaction } from '@/services/user/transaction'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

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
    if (!cartIds.length || !paymentId) {
      toast.warning('Cart atau metode pembayaran belum dipilih.')
      return
    }

    try {
      await createTransaction({ cartIds, paymentMethodId: paymentId }, token)
      toast.success('Booking berhasil!')
      router.push('/my-bookings')
    } catch (error) {
      console.error(error)
      toast.error('Booking gagal. Silakan coba lagi.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6"
    >
      <h1 className="text-2xl font-bold text-teal-700">Checkout</h1>

      <CartData onCartIdReady={setCartIds} />
      <PaymentOptions onPaymentIdSelect={setPaymentId} />

      <button
        onClick={handleBooking}
        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition cursor-pointer"
      >
        Booking
      </button>
    </motion.div>
  )
}

export default CheckoutPage
