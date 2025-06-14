'use client'

import { cancelTransaction, fetchTransaction } from '@/services/user/transaction'
import Cookies from 'js-cookie'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Transaction = () => {
  const [myTransaction, setMyTransaction] = useState([])
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = Cookies.get('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    const getTransaction = async () => {
      if (!token) return
      try {
        const response = await fetchTransaction(token)
        setMyTransaction(response)
      } catch (error) {
        console.error('Gagal mengambil transaksi:', error)
      }
    }

    getTransaction()
  }, [token])

  const handleCancel = async (transactionId) => {
    if (!token) return
    try {
      await cancelTransaction(transactionId, token)
      const updated = await fetchTransaction(token)
      setMyTransaction(updated)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-teal-700">Transaksi Saya</h1>

      {myTransaction.length === 0 ? (
        <p className="text-gray-600">Belum ada transaksi.</p>
      ) : (
        myTransaction.map((transaction) => (
          <div
            key={transaction.id}
            className="border border-teal-200 p-6 rounded-xl shadow-sm bg-white space-y-4"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-teal-800">
                Invoice: {transaction.invoiceId}
              </h2>
              <p className="text-gray-700">
                Status: <span className="capitalize text-teal-600">{transaction.status}</span>
              </p>
              <p className="text-gray-700">
                Total: <span className="text-gray-900 font-semibold">Rp {transaction.totalAmount.toLocaleString()}</span>
              </p>
              <p className="text-gray-700">
                Metode Pembayaran: {transaction.payment_method?.name || '-'}</p>
            </div>

            <div className="space-y-4">
              <p className="font-semibold text-gray-800">Item:</p>
              {transaction.transaction_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-teal-50 p-4 rounded-lg"
                >
                  <img
                    src={item.imageUrls?.[0] || '/placeholder.png'}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md border border-teal-100"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Harga: Rp {item.price.toLocaleString()}</p>
                    <Link href={`/my-bookings/${item.transactionId}`}>
                      <button className="mt-2 bg-teal-600 hover:bg-teal-700 text-white py-1.5 px-4 rounded text-sm">
                        Lihat Detail
                      </button>
                    </Link>
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleCancel(transaction.transaction_items[0].transactionId)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg"
              >
                Batalkan Transaksi
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Transaction
