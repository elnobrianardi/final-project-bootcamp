'use client'

import { motion } from 'framer-motion'

export default function Layout({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen px-4 md:px-8 py-6 bg-white  text-gray-900 ${className}`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.main>
  )
}
