"use client"

import { register } from "@/services/user/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast, ToastContainer } from "react-toastify"
import { fadeInUp } from "@/utils/variants"
import "react-toastify/dist/ReactToastify.css"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [passwordRepeat, setPasswordRepeat] = useState("")
  const [role, setRole] = useState("user")
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()

  const handleFileChange = (e) => {
    const fileList = e.target.files
    if (fileList?.length > 0) {
      const file = fileList[0]
      setProfilePictureFile(file)
      setProfilePictureUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== passwordRepeat) {
      toast.error("Password tidak cocok")
      return
    }

    try {
      await register({
        email,
        name,
        password,
        passwordRepeat,
        role,
        profilePictureUrl,
        phoneNumber,
      })
      toast.success("Pendaftaran berhasil!")
      setTimeout(() => router.push("/login"), 1000)
    } catch (err) {
      toast.error(err.message || "Gagal mendaftar")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-xl overflow-hidden max-w-4xl w-full">
        {/* IMAGE SIDE */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src="/register-illustration.png"
            alt="Register Illustration"
            onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
            className="h-full w-full object-cover"
          />
        </div>

        {/* FORM SIDE */}
        <motion.div
          {...fadeInUp}
          className="w-full md:w-1/2 p-8 space-y-5"
        >
          <h2 className="text-3xl font-bold text-center text-teal-700">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />

            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
            />

            <div className="flex gap-4">
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                required
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                placeholder="Repeat"
                type="password"
                required
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                />
                User
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Admin
              </label>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
            />
            {profilePictureUrl && (
              <img
                src={profilePictureUrl}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-full border"
              />
            )}

            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              type="number"
              required
            />

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md transition"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-teal-600 hover:underline">
              Login
            </Link>
          </p>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-teal-600 hover:underline inline-block mt-2"
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

export default Register
