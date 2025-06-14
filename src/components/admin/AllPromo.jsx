'use client'

import { createPromo, deletePromo, updatePromo } from '@/services/admin/promo'
import { fetchPromo } from '@/services/user/promo'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useState } from 'react'

const AllPromo = () => {

    const [promos, setPromos] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        terms_condition: '',
        promo_code: '',
        promo_discount_price: 0,
        minimum_claim_price: 0,
        id: null
    })
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const token = Cookies.get('token')

    useEffect(() => {
        const getPromo = async () => {
            try {
                const response = await fetchPromo()
                setPromos(response.data || [])
            } catch (error) {
                console.log('Error fetching promos: ',error);
                setPromos([]);
            } finally {
                setLoading(false)
            }
        }

        getPromo()
    }, [])

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!token) return alert('Token not found.')

        try {
            if(formData.id) {
                await updatePromo(formData.id, {
                    title: formData.title,
                    description: formData.description,
                    imageUrl: formData.imageUrl,
                    terms_consition: formData.terms_consition,
                    promo_code: formData.promo_code,
                    promo_discount_price: Number(formData.promo_discount_price),
                    minimum_claim_price: Number(formData.minimum_claim_price)
                }, token)
            } else {
                await createPromo({
                    title: formData.title,
                    description: formData.description,
                    imageUrl: formData.imageUrl,
                    terms_condition: formData.terms_condition,
                    promo_code: formData.promo_code,
                    promo_discount_price: Number(formData.promo_discount_price),
                    minimum_claim_price: Number(formData.minimum_claim_price)
                }, token)
            }
            location.reload()
        } catch (error) {
            console.log(error);
        }
    }

    const handleEdit = (promo) => {
        setFormData({
            id: promo.id,
            title: promo.title,
            description: promo.description,
            imageUrl: promo.imageUrl,
            terms_condition: promo.terms_condition,
            promo_code: promo.promo_code,
            promo_discount_price: promo.promo_discount_price,
            minimum_claim_price: promo.minimum_claim_price
        })
    }

    const handleDelete = async (id) => {
        if(!token) return alert ('Token not found.')
        if(!confirm('Are you sure you want to delete this promo?')) return
    
        try {
            await deletePromo(id, token)
            setPromos(promos.filter((promo) => promo.id !== id))
        } catch (error) {
            console.log(error);
        }
    }

    const {currentItems, totalPages, pageNumbers, indexofFirstItem} = useMemo(() => {
        const totalItems = promos.length
        const total = Math.ceil(totalItems / itemsPerPage)
        const calculatedIndexOfLastItem = currentPage * itemsPerPage
        const calculatedIndexofFirstItem = calculatedIndexOfLastItem - itemsPerPage
        const slicedItems = promos.slice(calculatedIndexofFirstItem, calculatedIndexOfLastItem)

        const numbers = []
        let startPage = Math.max(1, currentPage - 2)
        let endPage = Math.min(total, currentPage + 2)

        if (endPage - startPage + 1 < 5)  {
            if(currentPage - startPage < 2) endPage = Math.min(total, startPage + 4)
            else startPage = Math.max(1, endPage - 4)
        }

        while (endPage - startPage + 1 < 5 && endPage < total) endPage++
        while (endPage - startPage + 1 < 5 && startPage > 1) startPage--

        for (let i = startPage; i<= endPage; i++) numbers.push

        return {
            currentItems: slicedItems,
            totalPages: total,
            pageNumbers: numbers,
            indexofFirstItem: calculatedIndexofFirstItem
        }
    }, [promos, currentPage, itemsPerPage])

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page)
      }
    
      if(loading) {
        return <p className='text-center mt-10'>Loading promos...</p>
      }

      return (
        <div className='max-w-7xl mx-auto p-6'>
            <h1 className='text-2xl font-bold mb-4'>All Promos</h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className='mb-6 bg-gray-100 p-4 rounded'>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder='Title' required className='p-2 mr-2 mb-2 border rounded w-full'/>
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder='Description' required className='p-2 mr-2 mb-2 border rounded w-full'/>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder='Image URL' required className='p-2 mr-2 mb-2 border rounded w-full'/>
            <input type="text" name="terms_condition" value={formData.terms_condition} onChange={handleChange} placeholder='Terms and Conditions' required className='p-2 mr-2 mb-2 border rounded w-full'/>
            <input type="text" name="promo_code" value={formData.promo_code} onChange={handleChange} placeholder='Promo Code' required className='p-2 mr-2 mb-2 border rounded w-full}'/>
            <input type="number" name="promo_discount_price" value={formData.promo_discount_price} onChange={handleChange} placeholder='Promo Discount Price' required className='p-2 mr-2 mb-2 border rounded w-full'/>
            <input type="number" name="minimum_claim_price" value={formData.minimum_claim_price} onChange={handleChange} placeholder='Minimum Claim Price (optional)' className='p-2 mr-2 mb-2 border rounded w-full'/>
            <button type='submit' className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>
                {formData.id? 'Update' : 'Create'}
            </button>
        </form>

        {/* TABLE */}
        <table className='w-full border text-sm'>
           <thead className='bg-gray-200'>
                <tr>
                    <th className='p-2 border'>No</th>
                    <th className='p-2 border'>Title</th>
                    <th className='p-2 border'>Description</th>
                    <th className='p-2 border'>Image URL</th>
                    <th className='p-2 border'>Terms and Conditions</th>
                    <th className='p-2 border'>Promo Code</th>
                    <th className='p-2 border'>Promo Discount Price</th>
                    <th className='p-2 border'>Minimum Claim Price</th>
                    <th className='p-2 border'>Action</th>
                </tr>
           </thead>
           <tbody>
            {currentItems.map((promo, index) => (
                <tr key={promo.id}>
                    <td className='p-2 border'>{indexofFirstItem + index + 1}</td>
                    <td className='p-2 border'>{promo.title}</td>
                    <td className='p-2 border'>{promo.description}</td>
                    <td className='p-2 border'><img src={promo.imageUrl} alt={promo.title} onError={(e) => e.currentTarget.src = '/fallback-image.jpg'}/></td>
                    <td className='p-2 border'>{promo.terms_condition}</td>
                    <td className='p-2 border'>{promo.promo_code}</td>
                    <td className='p-2 border'>{promo.promo_discount_price}</td>
                    <td className='p-2 border'>{promo.minimum_claim_price}</td>
                    <td className='p-2 border space-y-2'>
                        <button onClick={() => handleEdit(promo)} className='text-yellow-600 hover:underline'>Edit</button>
                        <button onClick={() => handleDelete(promo.id)} className='text-red-600 hover:underline'>Delete</button>
                    </td>
                </tr>
            ))}
           </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
            <div className='flex justify-center gap-2 mt-6'>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='px-3 py-1 bg-blue-500 text-white rounded disabled:bg-grey-300'>Prev</button>
                {pageNumbers.map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded ${pagee === currentPage ? 'bg-blue-700' : 'bg-gray-200'}`}>
                        {page}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='px-3 py-1 bg-blue-500 text-white rounded disabled:bg-grey-300}'>Next</button>
            </div>
        )}
        </div>
      )
    }


export default AllPromo