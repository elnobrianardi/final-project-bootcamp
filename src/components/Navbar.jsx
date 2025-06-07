'use client'

import { X, ShoppingCart, User } from 'lucide-react'
import { logout } from '@/services/user/auth'
import { fetchCart } from '@/services/user/cart'  
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const Navbar = () => {
  const [token, setToken] = useState('')
  const [role, setRole] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const storedToken = Cookies.get('token')
    const userRole = Cookies.get('role')
    setRole(userRole)
    setToken(storedToken || '')

    if (storedToken) {
      fetchCartCount(storedToken)
    }
  }, [])

  const fetchCartCount = async (token) => {
    try {
      const response = await fetchCart(token)
      const totalQuantity = response.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(totalQuantity)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      setCartCount(0)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      Cookies.remove('token')
      Cookies.remove('role')
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
          <ShoppingCart />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: 1,
                minWidth: '20px',
                textAlign: 'center',
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      )}

      {token && <Link href="/profile"><User /></Link>}
      {token && role === 'admin' && <Link href="/admin">Admin</Link>}
      {token && <button onClick={handleLogout}>Logout</button>}
      {!token && <Link href="/login">Login</Link>}
      {!token && <Link href="/register">Register</Link>}
    </nav>
  )
}

export default Navbar
