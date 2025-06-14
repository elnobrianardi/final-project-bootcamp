'use client'

import { fetchPromoById } from '@/services/user/promo'
import React, { useEffect, useState } from 'react'

const PromoDetails = ({ params }) => {
  const [promo, setPromo] = useState(null)

  useEffect(() => {
    const getPromo = async () => {
      try {
        const data = await fetchPromoById(params.id)
        setPromo(data)
      } catch (error) {
        console.error('Failed to fetch promo:', error)
      }
    }

    getPromo()
  }, [params.id])

  if (!promo) {
    return <div className="p-6 text-center text-red-500">Promo tidak ditemukan.</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">{promo.title}</h1>

      <div className="overflow-hidden rounded-xl shadow group border">
        <img
          src={promo.imageUrl}
          alt={promo.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.target.src = '/fallback-image.jpg')}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4 text-gray-700 text-sm">
        <p><span className="font-semibold">Deskripsi:</span> {promo.description}</p>
        <p><span className="font-semibold">Kode Promo:</span> {promo.promo_code}</p>
        <p>
          <span className="font-semibold">Diskon:</span>{' '}
          <span className="text-emerald-600 font-bold">
            Rp {Number(promo.promo_discount_price || 0).toLocaleString('id-ID')}
          </span>
        </p>
        <p>
          <span className="font-semibold">Minimal Transaksi:</span>{' '}
          Rp {Number(promo.minimum_claim_price || 0).toLocaleString('id-ID')}
        </p>
        <p><span className="font-semibold">Syarat & Ketentuan:</span> {promo.terms_condition}</p>
      </div>
    </div>
  )
}

export default PromoDetails
