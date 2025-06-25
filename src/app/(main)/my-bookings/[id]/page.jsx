'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchTransactionById } from '@/services/user/transaction'
import { uploadPaymentProof } from '@/services/user/payment'
import { uploadImage } from '@/services/user/uploadImage'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

export default function MyBookingDetail() {
  const { id } = useParams()
  const [token, setToken] = useState('')
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [proofUrl, setProofUrl] = useState('')

  useEffect(() => {
    const storedToken = Cookies.get('token')
    if (storedToken) setToken(storedToken)
  }, [])

  useEffect(() => {
    const getData = async () => {
      if (!token || !id) return
      try {
        const data = await fetchTransactionById(id, token)
        setTransaction(data)
      } catch (err) {
        console.error('Gagal ambil data transaksi:', err)
        toast.error('Gagal memuat data transaksi.')
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [token, id])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setProofUrl(url)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Silakan pilih file terlebih dahulu.')
      return
    }

    try {
      const uploadedImageUrl = await uploadImage(file, token)
      await uploadPaymentProof(id, uploadedImageUrl, token)
      toast.success('Bukti pembayaran berhasil dikirim!')
    } catch (err) {
      console.error(err)
      toast.error('Gagal upload bukti pembayaran.')
    }
  }

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>
  if (!transaction) return <div className="p-4 text-red-500">Transaksi tidak ditemukan.</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 space-y-6 max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-teal-700">Detail Transaksi</h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="space-y-2 text-gray-700 bg-white p-4 rounded-xl shadow-sm border border-teal-100"
      >
        <p><span className="font-semibold">Invoice:</span> {transaction.invoiceId}</p>
        <p><span className="font-semibold">Pembayaran via:</span> {transaction.payment_method.name}</p>
        <p>
          <span className="font-semibold">Status:</span>{' '}
          <span className="capitalize text-teal-600">{transaction.status}</span>
        </p>
        <p><span className="font-semibold">Total:</span> Rp {transaction.totalAmount.toLocaleString()}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-teal-100"
      >
        <h2 className="text-lg font-bold text-teal-700">Item</h2>
        {transaction.transaction_items.map((item) => (
          <div key={item.id} className="p-3 border border-teal-100 rounded-md bg-teal-50">
            <p className="font-medium text-gray-800">Nama: {item.title}</p>
            <p className="text-sm text-gray-600">Harga: Rp {item.price.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Jumlah: {item.quantity}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="space-y-3"
      >
        <label className="block font-semibold text-gray-700">Upload Bukti Pembayaran:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full border border-teal-300 rounded p-2 text-sm file:mr-3 file:py-1 file:px-4 file:border-0 file:rounded-md file:bg-teal-600 file:text-white hover:file:bg-teal-700 transition"
        />
        {proofUrl && (
          <img src={proofUrl} alt="Preview" className="w-40 h-auto border rounded-md shadow" />
        )}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleUpload}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-md transition"
        >
          Upload Bukti Pembayaran
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
