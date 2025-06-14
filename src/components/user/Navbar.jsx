'use client'

import { Menu, X, ShoppingCart, User } from 'lucide-react'
import { logout } from '@/services/user/auth'
import { fetchCart } from '@/services/user/cart'
import Link from 'next/link'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'

const Navbar = () => {
  const [token, setToken] = useState('')
  const [role, setRole] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const storedToken = Cookies.get('token')
    const userRole = Cookies.get('role')
    setToken(storedToken || '')
    setRole(userRole)

    if (storedToken) fetchCartCount(storedToken)
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

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Activities', href: '/activity' },
    { label: 'Booking', href: '/my-bookings' },
    { label: 'About', href: '/about' }
  ]

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-teal-600">
          TravellingYuk!
        </Link>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-teal-600">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-teal-600 transition"
            >
              {item.label}
            </Link>
          ))}

          {token && (
            <Link href="/my-cart" className="relative text-teal-600">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {token && (
            <Link href="/profile" className="text-teal-600">
              <User size={24} />
            </Link>
          )}

          {token && role === 'admin' && (
            <Link href="/admin" className="text-sm px-3 py-1 rounded bg-teal-600 text-white hover:bg-teal-700 transition">
              Admin
            </Link>
          )}

          {token ? (
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1.5 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-4 py-1.5 rounded border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-1.5 rounded bg-teal-600 text-white hover:bg-teal-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-gray-700 hover:text-teal-600"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {token && (
            <Link href="/my-cart" className="flex items-center text-teal-600">
              <ShoppingCart size={20} className="mr-2" />
              Cart {cartCount > 0 && <span className="ml-1 text-red-500">({cartCount})</span>}
            </Link>
          )}

          {token && (
            <Link href="/profile" className="flex items-center text-teal-600">
              <User size={20} className="mr-2" />
              Profile
            </Link>
          )}

          {token && role === 'admin' && (
            <Link
              href="/admin"
              className="block text-sm px-3 py-1 rounded bg-teal-600 text-white hover:bg-teal-700"
            >
              Admin
            </Link>
          )}

          {token ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left text-sm px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-sm px-4 py-2 rounded border border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-sm px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
