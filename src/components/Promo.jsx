"use client";

import { fetchPromo } from "@/services/user/promo";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Promo = () => {
  const [promos, setPromos] = useState([]);

  const getPromo = async () => {
    try {
      const response = await fetchPromo();
      setPromos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPromo();
  }, []);

  return (
    <div>
      <h1 className="text-center text-xl font-bold">Promo</h1>
      <div className="grid grid-cols-4 gap-4">
        {promos.map((promo) => (
          <Link href={`/promo/${promo.id}`} key={promo.id}>
            <h1>{promo.title}</h1>
            <p>{promo.description}</p>
            <img src={promo.imageUrl} alt={promo.title} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Promo;
