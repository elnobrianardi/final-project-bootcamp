'use client'

import { fetchTransactionById } from '@/services/transaction'
import React, { useEffect, useState } from 'react'

const myBookingDetail = async ({params}) => {

    const resolvedParams = await params
    const [token, setToken] = useState('')

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
          setToken(storedToken)
        }
      }, [])
    
      const transaction = await fetchTransactionById(resolvedParams.id, token)
      if (!transaction) {
        return <div className="p-4 text-red-500">transaction not found.</div>
      }
  return (
    <div>
        <h1>Detail Transaksi</h1>
        <p>{transaction.title}</p>
        <p>{transaction.description}</p>
        <img src={transaction.imageUrl} alt={transaction.title} />
    </div>
  )
}

export default myBookingDetail