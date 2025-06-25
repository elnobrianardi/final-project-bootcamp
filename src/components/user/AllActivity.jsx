"use client";

import { useEffect, useState } from "react";
import { fetchActivity, filterByCategory } from "@/services/user/activity";
import Link from "next/link";
import { motion } from "framer-motion";

const fallbackImage = "/fallback-image.jpg";

export default function AllActivity() {
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const getAllActivities = async () => {
      try {
        const data = await fetchActivity();
        if (data) {
          setActivities(data);

          const uniqueCategories = data
            .map((item) => item.category)
            .filter(
              (cat, index, self) =>
                cat && index === self.findIndex((c) => c.id === cat.id)
            );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    getAllActivities();
  }, []);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setCurrentPage(1);

    try {
      const data =
        value === "" ? await fetchActivity() : await filterByCategory(value);
      setActivities(data);
    } catch (error) {
      console.error("Failed to filter activities:", error);
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = activities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Filter */}
      <div className="mb-6">
        <label
          htmlFor="category-filter"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Filter berdasarkan Kategori
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleChange}
          className="w-full md:w-1/2 rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="">-- Semua Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentItems.map((item) => (
          <Link key={item.id} href={`/activity/${item.id}`}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="group overflow-hidden rounded-xl border border-transparent bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.imageUrls?.[0] || fallbackImage}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 line-clamp-1 group-hover:text-teal-600 transition">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.city}, {item.province}
                </p>
                <p className="mt-2 text-sm font-bold text-teal-700">
                  Rp {Number(item.price_discount).toLocaleString("id-ID")}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`rounded px-4 py-2 text-sm  cursor-pointer ${
                currentPage === num
                  ? "bg-teal-600 text-white"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}
