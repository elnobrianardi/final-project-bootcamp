"use client";

import { fetchPromo } from "@/services/user/promo";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

const Promo = () => {
  const [promos, setPromos] = useState([]);
  const MAX_PROMOS = 8;
  const fallbackImage = "/fallback-image.jpg";
  const [loading, setLoading] = useState(true);

  const getPromo = async () => {
    try {
      const response = await fetchPromo();
      setPromos(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPromo();
  }, []);

  const displayedPromos = promos.slice(0, MAX_PROMOS);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 py-10"
    >
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-8">
        Promo Spesial untuk Liburanmu
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedPromos.map((promo) => (
          <Link
            href={`/promo/${promo.id}`}
            key={promo.id}
            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={promo.imageUrl || fallbackImage}
                alt={promo.title}
                onError={(e) => (e.currentTarget.src = fallbackImage)}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-teal-700 mb-1 line-clamp-1">
                  {promo.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {promo.description}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {promos.length > MAX_PROMOS && (
        <div className="text-center mt-8">
          <Link
            href="/promo"
            className="inline-block bg-teal-600 text-white px-6 py-2 rounded-md font-medium hover:bg-teal-700 transition"
          >
            Lihat Semua Promo
          </Link>
        </div>
      )}
    </motion.section>
  );
};

export default Promo;
