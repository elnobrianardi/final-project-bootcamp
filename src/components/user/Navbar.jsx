'use client'

import { Menu, X, ShoppingCart, User } from 'lucide-react'
import { logout } from '@/services/user/auth'
import { fetchCart } from '@/services/user/cart'
import Link from 'next/link'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  ]

  return (
    <nav className="bg-white/90 backdrop-blur border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-emerald-600 tracking-wide">
          TravellingYuk!
        </Link>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-emerald-600">
            {menuOpen ? <X size={28} className='cursor-pointer'/> : <Menu size={28} className='cursor-pointer'/>}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {token && (
            <Link href="/my-cart" className="relative text-emerald-600">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {token && (
            <Link href="/profile" className="text-emerald-600">
              <User size={24} />
            </Link>
          )}

          {token && role === 'admin' && (
            <Link
              href="/admin"
              className="text-sm px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Admin
            </Link>
          )}

          {token ? (
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1.5 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-4 py-1.5 rounded border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-4 pb-4 space-y-3 bg-white shadow-inner"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-emerald-600 font-medium"
              >
                {item.label}
              </Link>
            ))}

            {token && (
              <Link href="/my-cart" className="flex items-center text-emerald-600">
                <ShoppingCart size={20} className="mr-2" />
                Cart {cartCount > 0 && <span className="ml-1 text-red-500">({cartCount})</span>}
              </Link>
            )}

            {token && (
              <Link href="/profile" className="flex items-center text-emerald-600">
                <User size={20} className="mr-2" />
                Profile
              </Link>
            )}

            {token && role === 'admin' && (
              <Link
                href="/admin"
                className="block text-sm px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
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
                  className="block text-sm px-4 py-2 rounded border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-sm px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
