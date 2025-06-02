'use client'

import { fetchPromo } from '@/services/user/promo'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Promo = () => {

    const [promos, setPromos] = useState([])

    const getPromo = async() => {
        try {
            const response = await fetchPromo()
            setPromos(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPromo()
    }, [])

  return (
    <div>
        {promos.map((promo) => (
            <Link href={`/promo/${promo.id}`} key={promo.id}>
                <h1>{promo.title}</h1>
                <p>{promo.description}</p>
                <img src={promo.imageUrl} alt={promo.title} />
            </Link>
        ))}
    </div>
  )
}

export default Promo