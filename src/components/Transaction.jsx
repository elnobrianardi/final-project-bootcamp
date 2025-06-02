'use client'

import { cancelTransaction, fetchTransaction } from '@/services/user/transaction'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Transaction = () => {
  const [myTransaction, setMyTransaction] = useState([])
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
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

 const handleCancel = async(transactionId) => {
  if(!token) return
  try {
    const response = await cancelTransaction(transactionId, token)
    return response
  } catch (error) {
    console.log(error);
  }
 }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-4">Transaksi Saya</h1>
      {myTransaction.length === 0 ? (
        <p>Belum ada transaksi.</p>
      ) : (
        myTransaction.map((transaction) => (
          <div key={transaction.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-lg font-semibold mb-1">
              Invoice: {transaction.invoiceId}
            </h2>
            <p>Status: <span className="capitalize">{transaction.status}</span></p>
            <p>Total: Rp {transaction.totalAmount.toLocaleString()}</p>
            <p>Metode Pembayaran: {transaction.payment_method?.name || '-'}</p>

            <div className="mt-3">
              <p className="font-semibold mb-2">Item:</p>
              {transaction.transaction_items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 mb-3">
                  <img
                    src={item.imageUrls?.[0] || '/placeholder.png'}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Harga: Rp {item.price.toLocaleString()}</p>
                    <Link href={`/my-bookings/${item.transactionId}`}><button className='bg-blue-500 text-white py-2 px-5 rounded-lg'>Details</button></Link>
                  </div>
                </div>
              ))}
              <button onClick={()=>handleCancel(transaction.transaction_items[0].transactionId)} className='bg-red-500 py-2 px-5 rounded-lg'>Cancel Transaction</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Transaction
