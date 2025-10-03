import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const Homepage = () => {
  const [clients, setClients] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState("");
  const [gst, setGst] = useState("");
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      let url = "http://localhost:5000/api/clients/all?";
      if (gst) url += `gst=${gst}&`;
      if (sort) url += `sort=${sort}&`;

      const res = await fetch(url);
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [gst, sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) fetchClients();
      else alert("Failed to delete client!");
    } catch (err) {
      console.error(err);
      alert("Server error while deleting client!");
    }
  };

  const filteredClients = paymentFilter
    ? clients.filter((c) => c.payment === paymentFilter)
    : clients;

  const chartData = [
    {
      name: "Paid",
      value: filteredClients.filter((c) => c.payment === "Paid").length,
      fill: "#4caf50",
    },
    {
      name: "Not Paid",
      value: filteredClients.filter((c) => c.payment === "Not Paid").length,
      fill: "#f44336",
    },
  ];

  const totalClients = filteredClients.length;

  const handleChartClick = (data) => {
    if (!data || !data.activePayload || !data.activePayload[0]) return;
    const clickedName = data.activePayload[0].payload.name;
    if (clickedName === "Paid") setPaymentFilter("Paid");
    if (clickedName === "Not Paid") setPaymentFilter("Not Paid");
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#4F7E9A] via-[#5a9bb8] to-[#4F7E9A] text-gray-900">
      {/* Title */}
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        📊 Client Management Dashboard
      </motion.h1>

      {/* Filters + Chart */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        {/* Filters */}
        <motion.div
          className="flex space-x-4 bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] transition-all"
          >
            <option value="">Filter by Payment</option>
            <option value="Paid">Paid</option>
            <option value="Not Paid">Not Paid</option>
          </select>

          <select
            value={gst}
            onChange={(e) => setGst(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] transition-all"
          >
            <option value="">Filter by GST</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] transition-all"
          >
            <option value="">Sort</option>
            <option value="duedate">Sort by Due Date</option>
          </select>
        </motion.div>

        {/* Radial Chart */}
        <motion.div
          className="w-52 h-52 relative cursor-pointer bg-white/10 backdrop-blur-xl p-4 rounded-full shadow-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              barSize={20}
              data={chartData}
              startAngle={90}
              endAngle={-270}
              onClick={handleChartClick}
            >
              <RadialBar minAngle={15} background clockWise dataKey="value" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
            <span className="text-3xl font-bold text-white drop-shadow-md">
              {totalClients}
            </span>
            <span className="text-gray-200 text-sm">Total Clients</span>
          </div>
        </motion.div>
      </div>

      {/* Add Client Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/addclient")}
        className="bg-[#4F7E9A] hover:bg-[#3b6275] transition-colors duration-300 text-white px-6 py-3 rounded-xl shadow-lg font-semibold mb-6 block mx-auto"
      >
        ➕ Add New Client
      </motion.button>

      {/* Client Table */}
      <motion.div
        className="overflow-x-auto bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-[#4F7E9A] text-white">
            <tr>
              {["Name", "Email", "Phone", "Payment", "GST", "Invoice", "LR", "Deadline", "Actions"].map(
                (header) => (
                  <th key={header} className="px-4 py-2 text-sm font-semibold">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-200">
                  🚫 No clients found
                </td>
              </tr>
            ) : (
              filteredClients.map((c) => (
                <motion.tr
                  key={c._id}
                  className="text-center hover:bg-[#4F7E9A]/10 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.phone}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      c.payment === "Paid" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {c.payment}
                  </td>
                  <td className="px-4 py-2">{c.gst}</td>
                  <td className="px-4 py-2">
                    {c.invoice ? (
                      <a
                        href={`http://localhost:5000/${c.invoice.replace(/\\/g, "/")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-blue-700 hover:text-blue-900"
                      >
                        View PDF
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {c.lr ? (
                      <img
                        src={`http://localhost:5000/${c.lr.replace(/\\/g, "/")}`}
                        alt="LR"
                        className="w-16 h-16 object-cover mx-auto rounded-lg shadow-md"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2">{c.deadline?.slice(0, 10) || "—"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg shadow-md"
                      onClick={() => navigate(`/updateclient/${c._id}`)}
                    >
                      ✏️ Update
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow-md"
                      onClick={() => handleDelete(c._id)}
                    >
                      🗑️ Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Homepage;
