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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-strong p-8 w-full max-w-lg">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-cyan-300 mb-6 drop-shadow-neon">
          ➕ Add New Client
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-slate-900">
          <label className="form-label">Client Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
          <label className="form-label">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="form-control"
          />
          <label className="form-label">Contact Person</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="form-control"
          />
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-control"
          />

          {/* GST Dropdown */}
          <label className="form-label">GST Status</label>
          <select
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select GST Status</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          {/* Address */}
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="form-control"
          />

          {/* Payment Dropdown */}
          <label className="form-label">Payment Status</label>
          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Not Paid">Not Paid</option>
            <option value="Paid">Paid</option>
          </select>

          {/* Invoice Upload */}
          <div>
            <label className="form-label">Invoice (PDF)</label>
            <input
              type="file"
              name="invoice"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 rounded-md bg-white text-slate-900 border border-slate-300 focus:outline-none"
            />
          </div>

          {/* LR Upload */}
          <div>
            <label className="form-label">LR (Image)</label>
            <input
              type="file"
              name="lr"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 rounded-md bg-white text-slate-900 border border-slate-300 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-all shadow"
            >
              ⬅ Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold transition-all shadow-neon"
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
