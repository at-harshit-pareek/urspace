"use client";

import ProductCard from "@/app/components/card";
import Header from "@/app/components/header";
import axios from "axios";
import { useEffect, useState } from "react";

interface Space {
  id: string;
  name: string;
  thumbnail: string;
}

export default function Page() {
  const [data, setData] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://iww5u9cjm3.execute-api.ap-south-1.amazonaws.com/spacedashboard/space/all"
      );
      setData(response.data?.spaces || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching spaces:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="w-full p-4 bg-gray-100 shadow-md">
        <h1 className="text-2xl font-semibold text-center">
          <Header />
        </h1>
      </div>

      {/* Product Section */}
      <div className="w-full my-5 mx-5 justify-evenly gap-10 items-center grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : data.length > 0 ? (
          data.map((product) => (
            <ProductCard
              key={product.id}
              image={product.thumbnail}
              name={product.name}
              spaceId={product.id}
              onDelete={fetchData} // Trigger fetchData after deletion
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No spaces available.</p>
        )}
      </div>
    </div>
  );
}
