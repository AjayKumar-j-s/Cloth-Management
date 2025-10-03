import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddClient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    deadline: "",
    contact: "",
    email: "",
    phone: "",
    gst: "",
    address: "",
    payment: "Not Paid",
  });
  const [invoice, setInvoice] = useState(null);
  const [lr, setLr] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "invoice") setInvoice(e.target.files[0]);
    if (e.target.name === "lr") setLr(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (invoice) data.append("invoice", invoice);
    if (lr) data.append("lr", lr);

    const res = await fetch("http://localhost:5000/api/clients/add", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (result.success) {
      alert("✅ Client added successfully!");
      navigate("/"); 
    } else {
      alert("❌ Failed to add client: " + (result.error || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4F7E9A] via-[#6ea6bd] to-[#4F7E9A] p-6">
      <div className="bg-white/20 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-lg text-gray-900">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-md">
          ➕ Add New Client
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Client Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] shadow-sm"
          />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] shadow-sm"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Person"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] shadow-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] shadow-sm"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] shadow-sm"
          />

          {/* GST Dropdown */}
          <select
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] shadow-sm"
          >
            <option value="">Select GST Status</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          {/* Address */}
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] shadow-sm"
          />

          {/* Payment Dropdown */}
          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F7E9A] shadow-sm"
          >
            <option value="Not Paid">Not Paid</option>
            <option value="Paid">Paid</option>
          </select>

          {/* Invoice Upload */}
          <div>
            <label className="block mb-1 text-white font-semibold">Invoice (PDF)</label>
            <input
              type="file"
              name="invoice"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 rounded-lg bg-white/30 text-white border border-gray-300 focus:outline-none"
            />
          </div>

          {/* LR Upload */}
          <div>
            <label className="block mb-1 text-white font-semibold">LR (Image)</label>
            <input
              type="file"
              name="lr"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 rounded-lg bg-white/30 text-white border border-gray-300 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-all shadow-md"
            >
              ⬅ Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#4F7E9A] hover:bg-[#3b6275] text-white font-semibold transition-all shadow-lg"
            >
              ✅ Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
