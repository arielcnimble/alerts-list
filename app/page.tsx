"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/databricks-query');
        const result = await response.json();
        if (result?.result?.result?.data_array) {
          setData(result.result.result.data_array);
        } else {
          console.warn("No data returned from API");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (productId: string, productName: string) => {
    router.push(`/graph/${productId}?name=${encodeURIComponent(productName)}`);
  };
  
  return (
    <div className="min-h-screen bg-[#E0E7FF] font-sans">
      {/* Toolbar */}
      <nav className="bg-[#000000] text-white flex items-center justify-between p-4 shadow-md">
        <div className="text-xl font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
          Agent Board
        </div>
        <div className="space-x-4">
          <button className="bg-[#6D6FE2] px-4 py-2 rounded hover:bg-[#7c8dff]">Home</button>
          <button className="bg-[#6D6FE2] px-4 py-2 rounded hover:bg-[#7c8dff]">Reports</button>
          <button className="bg-[#6D6FE2] px-4 py-2 rounded hover:bg-[#7c8dff]">Settings</button>
        </div>
      </nav>

      {/* Table Section */}
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-[#000000]">Products Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-[#6D6FE2] text-white">
              <tr>
                <th className="p-4 text-left">Product Name</th>
                <th className="p-4 text-left">Brand</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-[#C7D2FE] cursor-pointer border-b border-gray-200"
                  onClick={() => handleRowClick(item[7], item[2])}

                >
                  <td className="p-4 text-[#1F2937] font-medium">{item[2]}</td>
                  <td className="p-4 text-[#1F2937]">{item[4]}</td>
                  <td className="p-4 text-[#1F2937]">${item[22]}</td>
                  <td className="p-4">
                    <button className="bg-[#6D6FE2] text-white px-3 py-1 rounded hover:bg-[#5a5ecf]">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <p className="text-center text-[#1F2937] mt-4">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;