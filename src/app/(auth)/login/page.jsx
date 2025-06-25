"use client"

import React, { useState } from "react"
import { login } from "@/services/user/auth"
import Cookies from "js-cookie"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { fadeInUp } from "@/utils/variants"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = await login({ email, password })

      Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "strict" })
      Cookies.set("role", data.data.role, { expires: 1, secure: true, sameSite: "strict" })

      toast.success("Login berhasil!")
      setTimeout(() => {
        router.push(callbackUrl)
      }, 1000)
    } catch (error) {
      toast.error(error.message || "Gagal login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-xl overflow-hidden max-w-4xl w-full">
        {/* IMAGE */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src="/login-illustration.png"
            alt="Login Illustration"
            onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
            className="h-full w-full object-cover"
          />
        </div>

        {/* FORM */}
        <motion.div
          {...fadeInUp}
          className="w-full md:w-1/2 p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-teal-700">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md transition"
            >
              Login
            </button>
          </form>

          <div className="text-sm text-center text-gray-600">
            Belum punya akun?{" "}
            <Link href="/register" className="text-teal-600 hover:underline">
              Daftar
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-teal-600 hover:underline inline-block mt-4"
            >
              ⬅ Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default Login
