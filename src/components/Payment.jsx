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
            console.log(error);
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
    <div className="mt-4">
      <h2 className="font-semibold mb-2">Pilih Metode Pembayaran</h2>
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          onClick={() => handleSelect(method.id)}
          className={`
              flex items-center space-x-2 px-4 py-2 border rounded 
              hover:bg-blue-100 
              ${selectedId === method.id ? 'bg-blue-500 text-white' : 'bg-white text-black'}
            `}
        >
          <img
            src={method.imageUrl}
            alt={method.name}
            className="w-8 h-8 inline-block mr-2"
          />
          {method.name}
        </button>
      ))}
    </div>
  )
}

export default PaymentOptions
