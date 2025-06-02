'use client'
import React, { useState } from 'react'
import { login } from '@/services/user/auth'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const data = await login({email, password})
            localStorage.setItem('token', data.token)
        } catch (error) {
            setError(error.message)
        }
    }

    
  return (
    <form onSubmit={handleSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='email'/>
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password'/>
        <button type='submit'>Login</button>
        {error && <p>{error}</p>}
    </form>
  )
}

export default Login