'use client'

import { fetchTransaction, updateTransactionStatus } from '@/services/admin/transaction'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AllTransaction = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const token = Cookies.get('token')

  useEffect(() => {
    const getTransaction = async () => {
      if (!token) return toast.error('Token not found')
      try {
        const response = await fetchTransaction(token)
        setTransactions(response || [])
      } catch (error) {
        toast.error('Error fetching transactions')
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    getTransaction()
  }, [token])

  const handleUpdate = async (id, status) => {
    try {
      await updateTransactionStatus(id, { status }, token)
      toast.success('Status updated successfully')
      const response = await fetchTransaction(token)
      setTransactions(response || [])
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const { currentItems, totalPages, pageNumbers, indexOfFirstItem } = useMemo(() => {
    const totalItems = transactions.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem)

    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)
    const pageNumbers = []

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return { currentItems, totalPages, pageNumbers, indexOfFirstItem }
  }, [transactions, currentPage])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) return <p className='text-center mt-10'>Loading...</p>

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>All Transactions</h1>

      <table className='w-full border text-sm'>
        <thead className='bg-gray-200'>
          <tr>
            <th className='p-2 border'>No</th>
            <th className='p-2 border'>Invoice ID</th>
            <th className='p-2 border'>Payment Method</th>
            <th className='p-2 border'>Amount</th>
            <th className='p-2 border'>Status</th>
            <th className='p-2 border'>Order Date</th>
            <th className='p-2 border'>Proof</th>
            <th className='p-2 border'>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((transaction, i) => (
            <tr key={transaction.id}>
              <td className='p-2 border'>{indexOfFirstItem + i + 1}</td>
              <td className='p-2 border'>{transaction.invoiceId}</td>
              <td className='p-2 border'>{transaction.payment_method?.name || '-'}</td>
              <td className='p-2 border'>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(transaction.totalAmount)}
              </td>
              <td className='p-2 border capitalize'>{transaction.status}</td>
              <td className='p-2 border'>
                {new Date(transaction.orderDate).toLocaleDateString('id-ID')}
              </td>
              <td className='p-2 border'>
                <img
                  src={transaction.proofPaymentUrl}
                  onError={(e) => (e.currentTarget.src = '/No_image_available.svg.png')}
                  alt='proof'
                  className='w-16 h-16 object-cover rounded'
                />
              </td>
              <td className='p-2 border'>
                <select
                  defaultValue={transaction.status}
                  onChange={(e) => handleUpdate(transaction.id, e.target.value)}
                  className='border px-2 py-1 rounded'
                >
                  <option value='success'>Success</option>
                  <option value='failed'>Failed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className='flex justify-center gap-2 mt-6'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300'
          >
            Prev
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300'
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default AllTransaction
