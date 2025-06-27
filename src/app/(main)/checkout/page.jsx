'use client'

import React, { useEffect, useState } from 'react'
import CartData from '@/components/user/CartData'
import PaymentOptions from '@/components/user/Payment'
import { createTransaction } from '@/services/user/transaction'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'

const CheckoutPage = () => {
  const router = useRouter()
  const [cartIds, setCartIds] = useState([])
  const [paymentId, setPaymentId] = useState(null)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = Cookies.get('token')
    if (storedToken) setToken(storedToken)

    const storedCartIds = localStorage.getItem('selectedCartIds')
    if (storedCartIds) {
      const parsed = JSON.parse(storedCartIds)
      setCartIds(parsed)
    }
    setLoading(false)
  }, [])

  const handleBooking = async () => {
    if (!cartIds.length || !paymentId) {
      toast.warning('Cart atau metode pembayaran belum dipilih.')
      return
    }

    try {
      await createTransaction({ cartIds, paymentMethodId: paymentId }, token)
      localStorage.removeItem('selectedCartIds')
      toast.success('Booking berhasil!')
      router.push('/my-bookings')
    } catch (error) {
      console.error(error)
      toast.error('Booking gagal. Silakan coba lagi.')
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
      className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6"
    >
      <h1 className="text-2xl font-bold text-teal-700">Checkout</h1>

      <CartData onCartIdReady={setCartIds} cartIds={cartIds}/>
      <PaymentOptions onPaymentIdSelect={setPaymentId} />

      <button
        onClick={handleBooking}
        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition cursor-pointer"
      >
        Booking
      </button>
      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  )
}

export default CheckoutPage
