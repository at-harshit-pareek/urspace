"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  image: string; // URL of the product image
  spaceId: string; // Space ID
  name: string; // Product name
  onDelete: () => void; // Callback to refresh data
}

const ProductCard: React.FC<ProductCardProps> = ({ image, name, spaceId, onDelete }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://iww5u9cjm3.execute-api.ap-south-1.amazonaws.com/spacedashboard/space/${spaceId}`
      );
      if (response.status === 200) {
        alert("Space deleted successfully");
        onDelete(); // Trigger re-fetch
      }
    } catch (error) {
      console.error("Failed to delete space:", error);
      alert("Failed to delete space. Please try again.");
    }
  };

  return (
    <div className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
      <a href="#">
        <img
          src={image}
          alt={name}
          className="h-40 w-72 object-cover rounded-t-xl"
        />
        <div className="px-4 py-3 w-72">
          <p className="text-lg font-bold text-black truncate block capitalize">
            {name}
          </p>
          <div className="flex items-center">
            <div className="ml-auto">
              <button
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProductCard;
