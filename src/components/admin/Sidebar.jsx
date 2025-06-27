'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Promo', href: '/admin/promo' },
  { label: 'Activities', href: '/admin/activity' },
  { label: 'Categories', href: '/admin/category' },
  { label: 'Users', href: '/admin/user' },
  { label: 'Banner', href: '/admin/banner' },
  {label: 'Transaction', href: '/admin/transaction'},
  {label: 'Back to home', href: '/'},
]

const AdminSidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-emerald-900 text-white fixed top-0 left-0 flex flex-col shadow-lg">
      <Link href={'/admin'} className="p-6 text-xl font-bold border-b border-gray-700">Admin Panel</Link>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded transition-all ${
                isActive ? 'bg-gray-900 font-semibold' : 'hover:bg-gray-700'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar
