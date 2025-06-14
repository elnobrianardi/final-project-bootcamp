'use client'

import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-teal-600 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} TravellingYuk! All rights reserved.
        </p>

        <div className="flex gap-4">
          <Link href="/" className="hover:underline hover:text-gray-100 transition cursor-pointer">Home</Link>
          <Link href="/about" className="hover:underline hover:text-gray-100 transition cursor-pointer">About</Link>
          <Link href="/contact" className="hover:underline hover:text-gray-100 transition cursor-pointer">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
