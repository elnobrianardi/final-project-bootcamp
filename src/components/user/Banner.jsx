"use client";

import { fetchBanner } from "@/services/user/banner";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const fallbackImage = "/fallback-image.jpg";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getBanner = async () => {
      try {
        const response = await fetchBanner();
        setBanners(response.data);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };

    getBanner();
  }, []);

  useEffect(() => {
    if (!banners.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-6xl mx-auto mt-6 rounded-lg overflow-hidden shadow-lg"
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={`/banner/${banner.id}`}
            className="w-full flex-shrink-0"
          >
            <div className="relative w-full h-64 md:h-80 lg:h-96">
              <img
                src={banner.imageUrl || fallbackImage}
                alt={banner.name}
                onError={(e) => (e.currentTarget.src = fallbackImage)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                  {banner.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              i === currentIndex ? "bg-teal-500 w-4" : "bg-white/70"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Banner;
