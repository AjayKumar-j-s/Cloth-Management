import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateClient = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);

  // Fetch client details on mount
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/clients/${id}`);
        const data = await res.json();

        // Format date for input type="date"
        if (data.deadline) {
          data.deadline = new Date(data.deadline).toISOString().split("T")[0];
        }

        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch client details");
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "invoice") setInvoice(e.target.files[0]);
    if (e.target.name === "lr") setLr(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (invoice) data.append("invoice", invoice);
      if (lr) data.append("lr", lr);

      const res = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Client updated successfully!");
        navigate("/");
      } else {
        alert("❌ Update failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error while updating client");
    }
  };

  if (loading) return <p className="p-6">Loading client details...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-strong p-8 w-full max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-cyan-300 drop-shadow-neon">✏️ Update Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
        <label className="form-label">Client Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-control"
          placeholder="Name"
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

        <label className="form-label">Contact</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
          className="form-control"
          placeholder="Contact"
        />

        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-control"
          placeholder="Email"
        />

        <label className="form-label">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-control"
          placeholder="Phone"
        />

        <label className="form-label">GST</label>
        <input
          type="text"
          name="gst"
          value={formData.gst}
          onChange={handleChange}
          required
          className="form-control"
          placeholder="GST"
        />

        <label className="form-label">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="form-control"
          placeholder="Address"
        />

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

        <div>
          <label className="form-label">Invoice (PDF)</label>
          <input className="w-full p-2 rounded-md bg-white text-slate-900 border border-slate-300" type="file" name="invoice" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <div>
          <label className="form-label">LR (Image)</label>
          <input className="w-full p-2 rounded-md bg-white text-slate-900 border border-slate-300" type="file" name="lr" accept="image/*" onChange={handleFileChange} />
        </div>

        <button type="submit" className="bg-cyan-700 hover:bg-cyan-800 transition-colors text-white px-4 py-2 rounded-lg shadow-neon">
          Update
        </button>
      </form>
      </div>
    </div>
  );
};

export default UpdateClient;
