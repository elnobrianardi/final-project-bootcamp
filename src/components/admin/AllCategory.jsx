'use client'

import { createCategory, deleteCategory, updateCategory } from '@/services/admin/category'
import { fetchCategory } from '@/services/user/category'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useState } from 'react'

const AllCategory = () => {

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        imageUrl: '',
        id: null
    })
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const token = Cookies.get('token')

    useEffect(() => {
        const getCategory = async () => {
            try {
                const response = await fetchCategory()
                setCategories(response || [])
            } catch (error) {
                console.log('Error fetching categories :', error);
                setCategories([]);
            } finally {
                setLoading(false)
            }
        }

        getCategory()
    }, [])

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!token) return alert('Token not found')

        try {
            if(formData.id){
                await updateCategory(formData.id, {
                    name: formData.name,
                    imageUrl: formData.imageUrl
                }, token)
            } else {
                await createCategory({
                    name: formData.name,
                    imageUrl: formData.imageUrl
                }, token)
            }
            location.reload()
        } catch (error) {
            console.log(error);
        }
    }

    const handleEdit = (cat) => {
        setFormData({
            id: cat.id,
            name: cat.name,
            imageUrl: cat.imageUrl,
        })
    }

    const handleDelete = async(id) => {
        if(!token) return alert ('Token not found')
        if(!confirm('Are you sure you want to delete this category?')) return

        try {
            await deleteCategory(id, token)
            setCategories(categories.filter((cat) => cat.id !== id))
        } catch (error) {
            console.log(error);
        }
    }

    const {currentItems, totalPages, pageNumbers, indexOfFirstItem} = useMemo(() => {
        const totalItems = categories.length
        const total = Math.ceil(totalItems / itemsPerPage)
        const calculatedIndexOfLastItem = currentPage * itemsPerPage
        const calculatedIndexOfFirstItem = calculatedIndexOfLastItem - itemsPerPage
        const slicedItems = categories.slice(calculatedIndexOfFirstItem, calculatedIndexOfLastItem)

        const numbers = []
        let startPage = Math.max(1, currentPage - 2)
        let endPage = Math.min(total, currentPage + 2)

        if(endPage - startPage < 5){
            if(currentPage - startPage < 2) endPage = Math.min(total, startPage + 4)
            else startPage = Math.max(1, endPage - 4)
        }

        while (endPage - startPage + 1 < 5 && endPage < total) endPage++
        while (endPage - startPage + 1 < 5 && startPage > 1) startPage--

        for(let i = startPage; i <= endPage; i++){
            numbers.push(i)
        }

        return{
            currentItems: slicedItems,
            totalPages: total,
            pageNumbers: numbers,
            indexOfFirstItem: calculatedIndexOfFirstItem
        }
    }, [categories, currentPage, itemsPerPage])

    const handlePageChange = (page) => {
        if(page >= 1 && page <= totalPages) setCurrentPage(page)
    }

    if(loading){
        return <p className='text-center mt-10'>Loading categories...</p>
    }

  return (
    <div className='max-w-4xl mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-4'>All Category</h1>
    
    {/* FORM */}
    <form onSubmit={handleSubmit} className='mb-6 bg-gray-100 p-4 rounded'>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Title' required className='pr-2 mr-2 mb-2 border rounded w-full' />
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder='Image URL' required className='pr-2 mr-2 mb-2 border rounded w-full' />
        <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>{formData.id ? 'Update' : 'Create'}</button>
    </form>

    {/* TABLE */}
    <table className='w-full border text-sm'>
        <thead className='bg-gray-200'>
            <tr>
                <th className='p-2 border'>No</th>
                <th className='p-2 border'>Name</th>
                <th className='p-2 border'>Image</th>
                <th className='p-2 border'>Action</th>
            </tr>
        </thead>
        <tbody>
            {currentItems.map((cat, index) => (
                <tr key={cat.id}>
                    <td className='border p-2'>{indexOfFirstItem + index + 1}</td>
                    <td className='p-2 border'>{cat.name}</td>
                    <td className='p-2 border'><img src={cat.imageUrl} alt={cat.name} className='w-16 h-16 object-cover' onError={(e) => e.currentTarget.src = '/fallback-image.jpg'}/></td>
                    <td className='p-2 border space-x-2'>
                        <button onClick={() => handleEdit(cat)} className='text-yellow-600 hover:underline'>Edit</button>
                        <button onClick={() => handleDelete(cat.id)} className='text-red-600 hover:underline'>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
            <div className='flex justify-center gap-2 mt-6'>
                <button onClick={() => handlePageChange(currentPage -1 )} disabled={currentPage === 1} className='px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300'>Prev</button>
                {pageNumbers.map(page => (
                    <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}>
                        {page}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300'>Next</button>
            </div>
        )}
    </div>
  )
}

export default AllCategory