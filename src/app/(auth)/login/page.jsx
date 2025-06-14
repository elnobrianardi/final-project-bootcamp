"use client"
import React, { useState } from "react"
import { login } from "@/services/user/auth"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import Link from "next/link"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const data = await login({ email, password })

      Cookies.set("token", data.token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      })

      Cookies.set("role", data.data.role, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      })

      router.push("/")
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-16 bg-white rounded-xl shadow-md p-8 space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-teal-700">Login</h2>

      <div className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md transition cursor-pointer"
      >
        Login
      </button>

      {error && <p className="text-red-600 text-center text-sm">{error}</p>}

      <p className="text-center text-sm text-gray-600">
        Belum punya akun?{" "}
        <Link href="/register" className="text-teal-600 hover:underline">
          Daftar
        </Link>
      </p>
    </form>
  )
}

export default Login
