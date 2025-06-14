"use client";

import { useEffect, useState } from "react";
import { fetchActivity, filterByCategory } from "@/services/user/activity";
import Link from "next/link";

const fallbackImage = "/fallback-image.jpg";

export default function Activity() {
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
      if (value === "") {
        const allActivities = await fetchActivity();
        setActivities(allActivities);
      } else {
        const filteredActivities = await filterByCategory(value);
        setActivities(filteredActivities);
      }
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
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-8">
        Aktivitas Menarik
      </h1>

      {/* Filter */}
      <div className="mb-8">
        <label
          htmlFor="category-filter"
          className="block mb-2 font-medium text-gray-700"
        >
          Filter Kategori
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">-- Semua Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="grid gap-6 md:grid-cols-2">
        {currentItems.map((item) => (
          <Link
            key={item.id}
            href={`/activity/${item.id}`}
            className="block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <img
              src={item.imageUrls?.[0] || fallbackImage}
              alt={item.title}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
              className="w-full h-44 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-teal-800 mb-1">{item.title}</h2>
              <p className="text-sm text-gray-600">
                {item.city}, {item.province}
              </p>
              <p className="text-sm mt-2 font-semibold text-teal-600">
                Rp {item.price_discount}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-4 py-2 border rounded-md transition ${
              currentPage === num
                ? "bg-teal-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </section>
  );
}
