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

  const handleSendReminder = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/clients/${id}/send-reminder`, {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        alert("✅ Reminder email sent!");
      } else {
        alert("❌ Failed to send reminder: " + (result.message || result.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Server error while sending reminder!");
    }
  };

  const filteredClients = paymentFilter
    ? clients.filter((c) => c.payment === paymentFilter)
    : clients;

  const chartData = [
    {
      name: "Paid",
      value: filteredClients.filter((c) => c.payment === "Paid").length,
      fill: "#22d3ee" // cyan-400 for high contrast
    },
    {
      name: "Not Paid",
      value: filteredClients.filter((c) => c.payment === "Not Paid").length,
      fill: "#fb7185" // rose-400 for high contrast
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
    <div className="p-8 min-h-screen text-gray-900">
      {/* Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-cyan-300 drop-shadow-neon tracking-wide"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        📊 Client Management Dashboard
      </motion.h1>

      {/* Filters + Chart */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        {/* Filters */}
        <motion.div
          className="flex flex-wrap gap-4 glass-card p-4"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div>
            <label className="form-label">Payment</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="form-control min-w-[180px]"
            >
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Not Paid">Not Paid</option>
            </select>
          </div>

          <div>
            <label className="form-label">GST</label>
            <select
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              className="form-control min-w-[160px]"
            >
              <option value="">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="form-label">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-control min-w-[180px]"
            >
              <option value="">Default</option>
              <option value="duedate">By Due Date</option>
            </select>
          </div>
        </motion.div>

        {/* Radial Chart */}
        <motion.div
          className="w-56 h-56 relative cursor-pointer glass-strong p-4 rounded-full shadow-neon border border-cyan-400/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="68%"
              outerRadius="100%"
              barSize={18}
              data={chartData}
              startAngle={90}
              endAngle={-270}
              onClick={handleChartClick}
            >
              <RadialBar minAngle={12} background={{ fill: "rgba(255,255,255,0.08)" }} cornerRadius={8} clockWise dataKey="value" />
              <Tooltip 
                contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 8, color: "#e2e8f0" }} 
                itemStyle={{ color: "#e2e8f0" }} 
                labelStyle={{ color: "#22d3ee" }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
            <span className="text-3xl font-bold text-cyan-300 drop-shadow-neon">
              {totalClients}
            </span>
            <span className="text-cyan-200 text-sm">Total Clients</span>
          </div>
        </motion.div>
      </div>

      {/* Add Client Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/addclient")}
        className="btn-neon px-6 py-3 font-semibold mb-6 block mx-auto"
      >
        ➕ Add New Client
      </motion.button>

      {/* Client Table */}
      <motion.div
        className="overflow-x-auto glass-card p-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-cyan-700 text-white">
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
                      c.payment === "Paid" ? "text-green-700" : "text-red-700"
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
                        className="underline text-cyan-700 hover:text-cyan-900"
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
                  <td className="px-4 py-2">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[220px] mx-auto">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        className="bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-full shadow-neon w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
                        onClick={() => navigate(`/updateclient/${c._id}`)}
                        aria-label="Update"
                        title="Update"
                      >
                        <span className="text-base sm:text-lg">✏️</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        className="bg-rose-600/90 hover:bg-rose-600 text-white rounded-full shadow-neon w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
                        onClick={() => handleDelete(c._id)}
                        aria-label="Delete"
                        title="Delete"
                      >
                        <span className="text-base sm:text-lg">🗑️</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        className="bg-cyan-600/90 hover:bg-cyan-600 text-white rounded-full shadow-neon w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
                        onClick={() => handleSendReminder(c._id)}
                        aria-label="Send reminder"
                        title="Send reminder"
                      >
                        <span className="text-base sm:text-lg">🔔</span>
                      </motion.button>
                    </div>
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
