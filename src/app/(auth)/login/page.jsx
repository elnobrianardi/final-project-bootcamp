'use client'
import React, { useState } from 'react'
import { login } from '@/services/user/auth'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const data = await login({email, password})
            
            Cookies.set('token', data.token, {
                expires: 1,
                secure: true,
                sameSite: 'strict'
            })

            Cookies.set('role', data.data.role, {
                expires: 1,
                secure: true,
                sameSite: 'strict'
            })
            
            router.push('/')
        } catch (error) {
            setError(error.message)
        }
    }

    
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
        <h2 className='text-2xl font-bold'>Login</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='email' className='border w-full p-2'/>
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' className='border w-full p-2'/>
        <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>Login</button>
        {error && <p className='text-red-500'>{error}</p>}
    </form>
  )
}

export default Login