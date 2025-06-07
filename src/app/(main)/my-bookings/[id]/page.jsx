'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchTransactionById } from '@/services/user/transaction'
import { uploadPaymentProof } from '@/services/user/payment'
import { uploadImage } from '@/services/user/uploadImage' // import service upload image
import Cookies from 'js-cookie'

export default function MyBookingDetail() {
  const { id } = useParams()
  const [token, setToken] = useState('')
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [proofUrl, setProofUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    setError('')
    setSuccess('')

    if (!file) {
      setError('Silakan pilih file terlebih dahulu.')
      return
    }

    try {
      // Upload gambar dulu
      const uploadedImageUrl = await uploadImage(file, token)

      // Kirim URL bukti pembayaran ke transaksi
      await uploadPaymentProof(id, uploadedImageUrl, token)

      setSuccess('Bukti pembayaran berhasil dikirim!')
    } catch (err) {
      console.error(err)
      setError('Gagal upload bukti pembayaran.')
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (!transaction) return <div className="p-4 text-red-500">Transaksi tidak ditemukan.</div>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Detail Transaksi</h1>
      <p>Invoice: {transaction.invoiceId}</p>
      <p className="text-lg">Pembayaran via: {transaction.payment_method.name}</p>
      <p>Status: {transaction.status}</p>
      <p>Total : {transaction.totalAmount}</p>
      <div>
        <h2 className="text-lg font-bold">Item</h2>
        {transaction.transaction_items.map((item) => (
          <div key={item.id}>
            <p>Nama: {item.title}</p>
            <p>Harga: {item.price}</p>
            <p>Jumlah: {item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {proofUrl && (
          <img src={proofUrl} alt="Preview" className="w-40 h-auto border rounded-md" />
        )}
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded-lg"
          onClick={handleUpload}
        >
          Upload bukti pembayaran
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </div>
    </div>
  )
}
