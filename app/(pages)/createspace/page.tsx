"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const UploadForm = () => {
    const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    mimeType: "image/png",
    dimensions: "1024x768",
    mapId: "",
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Step 1: Request the presigned URL from the backend

      const response = await axios.post("https://iww5u9cjm3.execute-api.ap-south-1.amazonaws.com/spacedashboard/space", {
        name: formData.name,
        mimeType: formData.mimeType,
        dimensions: formData.dimensions,
        mapId: formData.mapId,
      });

      const url = response.data.presignedUrl;
      console.log("Presigned URL:", url);

      // Step 2: Upload the file to S3 using the presigned URL
      if (formData.file && url) {
        const putResponse = await axios.put(url, formData.file, {
          headers: {
            "Content-Type": formData.mimeType, // Set the MIME type
          },
        });

        if (putResponse.status === 200) {
          alert("File uploaded successfully!");
        } else {
          alert("Failed to upload the file.");
        }
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 border border-gray-300 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="mapId" className="block text-sm font-medium text-gray-700">
          Map ID
        </label>
        <input
          type="text"
          id="mapId"
          name="mapId"
          value={formData.mapId}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="mimeType" className="block text-sm font-medium text-gray-700">
          Mime Type
        </label>
        <input
          type="text"
          id="mimeType"
          name="mimeType"
          value={formData.mimeType}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
          Dimensions
        </label>
        <input
          type="text"
          id="dimensions"
          name="dimensions"
          value={formData.dimensions}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Choose Image
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
        
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

export default UploadForm;
