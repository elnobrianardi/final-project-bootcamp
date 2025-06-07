"use client";

import { fetchCategory } from "@/services/user/category";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Category = () => {
  const [categories, setCategories] = useState([]);

  const getCategory = async () => {
    try {
      const response = await fetchCategory();
      setCategories(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div>
      <h1 className="text-center font-bold font-xl">Category</h1>
      <div className="grid grid-cols-4 gap-4">
        {categories.map((item) => (
          <Link key={item.id} href={`/category/${item.id}`}>
            <h1>{item.name}</h1>
            <img src={item.imageUrl} alt={item.name} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
