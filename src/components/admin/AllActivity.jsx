'use client'

import { createActivity, deleteActivity, updateActivity } from '@/services/admin/activity'
import { fetchActivity } from '@/services/user/activity'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useState } from 'react'

const AllActivity = () => {

    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        categoryId : '',
        title : '',
        description : '',
        imageUrls : [],
        price: 0,
        price_discount: 0,
        rating: 0,
        total_reviews: 0,
        facilities: '',
        address: '',
        province: '',
        city: '',
        location_maps: '',
        id : null
    })
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const token = Cookies.get('token')

    useEffect (() => {
       const getActivity = async () => {
        if(!token) return alert('Token not found')

        try {
            const response = await fetchActivity()
            setActivities(response || [])
        } catch (error) {
            console.log('Error fetching activity: ',error);
            setActivities([])
        } finally {
            setLoading(false)
        }
       } 
       getActivity()
    }, [])


    const handleChange = (e) => {
        const { name, value } = e.target

        if(name === 'imageUrls') {
            const urlsArray = value.split(',').map(url => url.trim())
            setFormData({...formData, imageUrls : urlsArray})
        } else {
            setFormData({ ...formData, [name]: value})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!token) return alert ('Token not found')

        try {
            if(formData.id){
                await updateActivity(formData.id, {
                    categoryId : formData.categoryId,
                    title : formData.title,
                    description : formData.description,
                    imageUrls : formData.imageUrls,
                    price: Number(formData.price),
                    price_discount: Number(formData.price_discount),
                    rating: Number(formData.rating),
                    total_reviews: Number(formData.total_reviews),
                    facilities: formData.facilities,
                    address: formData.address,
                    province: formData.province,
                    city: formData.city,
                    location_maps: formData.location_maps
                }, token)
                } else {
                    await createActivity({
                        categoryId : formData.categoryId,
                        title : formData.title,
                        description : formData.description,
                        imageUrls : formData.imageUrls,
                        price: Number(formData.price),
                        price_discount: Number(formData.price_discount),
                        rating: Number(formData.rating),
                        total_reviews: Number(formData.total_reviews),
                        facilities: formData.facilities,
                        address: formData.address,
                        province: formData.province,
                        city: formData.city,
                        location_maps: formData.location_maps
                    }, token)
                }
                // location.reload()
        } catch (error) {
            console.log(error);
        }
    }

    const handleEdit = (activity) => {
        setFormData({
            id: activity.id,
            categoryId : activity.categoryId,
            title : activity.title,
            description : activity.description,
            imageUrls : Array.isArray(activity.imageUrls) ? activity.imageUrls : [],
            price: activity.price,
            price_discount: activity.price_discount,
            rating: activity.rating,
            total_reviews: activity.total_reviews,
            facilities: activity.facilities,
            address: activity.address,
            province: activity.province,
            city: activity.city,
            location_maps: activity.location_maps
        })
    }

    const handleDelete = async (id) => {
        if(!token) return alert ('Token not found')
        if(!confirm('Are you sure you want to delete this activity?')) return

        try {
            const response = await deleteActivity(id, token)
            setActivities(activities.filter((activity) => activity.id !== id))
        } catch (error) {
            console.log(error);
        }
    }

    const {currentItems, totalPages, pageNumbers, indexOfFirstItem} = useMemo (() => {
        const totalItems = activities.length
        const total = Math.ceil(totalItems / itemsPerPage)
        const calculatedIndexofLastItem = currentPage * itemsPerPage
        const calculatedIndexofFirstItem = calculatedIndexofLastItem - itemsPerPage
        const slicedItems = activities.slice(calculatedIndexofFirstItem, calculatedIndexofLastItem)

        const numbers = []
        let startPage = Math.max(1, currentPage -2)
        let endPage = Math.min(total, currentPage + 2)

        if(endPage - startPage < 5){
            if(currentPage - startPage < 2) endPage = Math.min(total, startPage + 4)
            else startPage = Math.max(1, endPage - 4)
        }

        while (endPage - startPage + 1 < 5 && endPage && total) endPage ++
        while (endPage - startPage + 1 < 5 && startPage > 1) startPage --

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i)
        }

        return{
            currentItems: slicedItems,
            totalPages: total,
            pageNumbers: numbers,
            indexOfFirstItem: calculatedIndexofFirstItem
        }
    }, [activities, currentPage, itemsPerPage])

    const handlePageChange = (page) => {
        if(page >= 1 && page <= totalPages) setCurrentPage(page)
    }

    if(loading){
        return <p className='text-center mt-10'>Loading activities...</p>
    }

  return (
    <div className='max-w-4xl mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-4'>All Activities</h1>
    
    {/* FORM */}
    <form onSubmit={handleSubmit} className='mb-6 bg-gray-100 p-4 rounded'>
        <input type="text" name="categoryId" value={formData.categoryId} onChange={handleChange} placeholder='Category Id' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder='Title' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder='Description' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="text" name="imageUrls" value={Array.isArray(formData.imageUrls) ? formData.imageUrls.join(', ') : formData.imageUrls} onChange={handleChange} placeholder='Image Urls' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder='Price' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="number" name="price_discount" value={formData.price_discount} onChange={handleChange} placeholder='Price Discount' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="number" name="rating" value={formData.rating} onChange={handleChange} placeholder='Rating' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="number" name="total_reviews" value={formData.total_reviews} onChange={handleChange} placeholder='Total Reviews' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} placeholder='Facilities' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder='Address' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="text" name="province" value={formData.province} onChange={handleChange} placeholder='Province' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder='City' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <input type="text" name="location_maps" value={formData.location_maps} onChange={handleChange} placeholder='Location Maps' required className='pr-2 mr-2 mb-2 border rounded w-full'/>
        <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>
            {formData.id? 'Update' : 'Create'}
        </button>
    </form>

    <table className='w-full border text-sm'>
        <thead className='bg-gray-200'>
            <tr>
                <th className='p-2 border'>No</th>
                <th className='p-2 border'>Title</th>
                <th className='p-2 border'>Description</th>
                <th className='p-2 border'>Image Urls</th>
                <th className='p-2 border'>Price</th>
                <th className='p-2 border'>Price Discount</th>
                <th className='p-2 border'>Rating</th>
                <th className='p-2 border'>Total Reviews</th>
                <th className='p-2 border'>Facilities</th>
                <th className='p-2 border'>Address</th>
                <th className='p-2 border'>Province</th>
                <th className='p-2 border'>City</th>
                <th className='p-2 border'>Location Maps</th>
                <th className='p-2 border'>Action</th>
            </tr>
        </thead>
        <tbody>
            {currentItems.map((activity, index) => (
                <tr key={activity.id}>
                    <td className='border p-2'>{indexOfFirstItem + index + 1}</td>
                    <td className='border p-2'>{activity.title}</td>
                    <td className='border p-2'>{activity.description}</td>
                    <td className='border p-2'><img src={activity.imageUrls[0]} alt="" /></td>
                    <td className='border p-2'>{activity.price}</td>
                    <td className='border p-2'>{activity.price_discount}</td>
                    <td className='border p-2'>{activity.rating}</td>
                    <td className='border p-2'>{activity.total_reviews}</td>
                    <td className='border p-2'>{activity.facilities}</td>
                    <td className='border p-2'>{activity.address}</td>
                    <td className='border p-2'>{activity.province}</td>
                    <td className='border p-2'>{activity.city}</td>
                    <td className='border p-2'>
                        <div dangerouslySetInnerHTML={{ __html: activity.location_maps}}>
                        </div></td>
                    <td className='border p-2'>
                        <button onClick={() => handleEdit(activity)}>Edit</button>
                        <button onClick={() => handleDelete(activity.id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
  )
}

export default AllActivity