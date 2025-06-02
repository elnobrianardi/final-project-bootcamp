import { fetchCategoryById } from '@/services/user/category'
import React from 'react'

const categoryDetail = async ({params}) => {

    const resolvedParams = await params
    const category = await fetchCategoryById(resolvedParams.id)

    if(!category) {
        return <div className="p-4 text-red-500">Category not found.</div>
    }

  return (
    <div>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <img src={category.imageUrl} alt="" />
    </div>
  )
}

export default categoryDetail