'use client'

import { logout } from '@/services/auth'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Navbar = () => {

    const [token, setToken] = useState('')

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        setToken(storedToken)
    })

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem('token')
      console.log('Token removed')
      window.location.href = '/login' // redirect after logout
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav>
      <Link href="/">Home</Link>
      {token && <Link href="/my-cart">My Cart</Link>}
      {token && <button onClick={handleLogout}>Logout</button>}
      {!token && <Link href="/login">Login</Link>}
      {!token && <Link href="/register">Register</Link>}
    </nav>
  )
}

export default Navbar
