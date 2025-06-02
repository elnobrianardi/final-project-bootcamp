'use client'

import { logout } from '@/services/user/auth'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Navbar = () => {
  const [token, setToken] = useState('')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setToken(storedToken || '')
    setCartCount(storedCart.length)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem('token')
      console.log('Token removed')
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className='flex justify-between items-center p-4 border-b'>
      <Link href="/">Home</Link>

      {token && (
        <Link href="/my-cart" className="relative">
          <span>My Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      )}

      {token && <Link href="/profile">My Profile</Link>}
      {token && <button onClick={handleLogout}>Logout</button>}
      {!token && <Link href="/login">Login</Link>}
      {!token && <Link href="/register">Register</Link>}
    </nav>
  )
}

export default Navbar
