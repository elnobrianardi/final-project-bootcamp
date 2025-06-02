import { fetchPromoById } from '@/services/user/promo'
import React from 'react'

const PromoDetails = async ({params}) => {

    const resolvedParams = await params
    const promo = await fetchPromoById(resolvedParams.id)

    if(!promo) {
        return <div className="p-4 text-red-500">Promo not found.</div>
    }

  return (
    <div>
        <h1>{promo.title}</h1>
        <p>{promo.description}</p>
        <img src={promo.imageUrl} alt="" />
    </div>
  )
}

export default PromoDetails