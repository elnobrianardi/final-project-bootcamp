"use client";

import { fetchCategory } from "@/services/user/category";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const fallbackImage = "/fallback-image.jpg";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const MAX_DISPLAY = 6;

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await fetchCategory();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    getCategory();
  }, []);

  const displayedCategories = categories.slice(0, MAX_DISPLAY);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 py-10"
    >
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-8">
        Jelajahi Kategori
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayedCategories.map((item) => (
          <Link
            key={item.id}
            href={`/category/${item.id}`}
            className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 17 }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.imageUrl || fallbackImage}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h2 className="text-base font-semibold text-teal-700 group-hover:text-teal-600 transition">
                  {item.name}
                </h2>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {categories.length > MAX_DISPLAY && (
        <div className="text-center mt-8">
          <Link
            href="/category"
            className="inline-block bg-teal-600 text-white px-6 py-2 rounded-md font-medium hover:bg-teal-700 transition"
          >
            Lihat Semua Kategori
          </Link>
        </div>
      )}
    </motion.section>
  );
};

export default Category;
