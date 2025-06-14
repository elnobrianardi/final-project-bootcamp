'use client'

import { fetchPayment } from "@/services/user/payment"
import { useState, useEffect } from "react"

const PaymentOptions = ({ onPaymentIdSelect }) => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const getPaymentMethods = async () => {
    try {
      const response = await fetchPayment()
      setPaymentMethods(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPaymentMethods()
  }, [])

  const handleSelect = (id) => {
    setSelectedId(id)
    onPaymentIdSelect(id)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-teal-700">Pilih Metode Pembayaran</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleSelect(method.id)}
            className={`flex items-center gap-3 p-4 border rounded-lg shadow-sm transition cursor-pointer
              ${selectedId === method.id ? 'bg-teal-600 text-white' : 'bg-white hover:bg-teal-50 text-gray-800'}
            `}
          >
            <img
              src={method.imageUrl}
              alt={method.name}
              className="w-8 h-8 object-contain"
            />
            <span className="text-sm font-medium">{method.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PaymentOptions
