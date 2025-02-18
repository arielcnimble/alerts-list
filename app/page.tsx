"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [readRows, setReadRows] = useState<Record<string, boolean>>({}); // Store read status per Alert ID
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/databricks-query");
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

  // Toggle read/unread state
  const toggleReadStatus = async (alertId: string) => {
    setReadRows((prev) => {
      const updatedReadRows = { ...prev, [alertId]: !prev[alertId] };
      return updatedReadRows;
    });

    // Send API request to update backend (optional)
    await fetch("/api/toggle-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertId }),
    });
  };

  const handleRowClick = (productId: string, alertId: string) => {
    router.push(`/graph/${productId}?alertId=${alertId}`);
  };

  return (
    <div className="min-h-screen bg-[#E0E7FF] font-sans overflow-x-auto p-6">
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
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Notification Name</th>
                <th className="p-4 text-left">Product ID</th>
                {/*<th className="p-4 text-left">Alert ID</th>*/}
                <th className="p-4 text-left">Mark Read</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const productId = item[2]; // Assuming item[2] is productId
                const alertId = item[3]; // Assuming item[3] is alertId
                const isRead = readRows[alertId] || false; // Check if row is read

                return (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 cursor-pointer ${
                      isRead ? "bg-gray-200" : "bg-white hover:bg-[#C7D2FE]"
                    }`}
                  >
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{item[0]}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{item[1]}</td>
                    <td className="p-4 text-[#1F2937] whitespace-nowrap">{productId}</td>
                    {/*<td className="p-4 text-[#1F2937] whitespace-nowrap">{alertId}</td>*/}
                    {/* Checkbox for Read/Unread */}
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isRead}
                        onChange={() => toggleReadStatus(alertId)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                      />
                    </td>
                    {/* View Details Button */}
                    <td className="p-4">
                      <button
                        className="bg-[#6D6FE2] text-white px-3 py-1 rounded hover:bg-[#5a5ecf]"
                        onClick={() => handleRowClick(productId, alertId)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
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