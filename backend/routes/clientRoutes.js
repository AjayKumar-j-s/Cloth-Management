import express from "express";
import multer from "multer";
import Client from "../models/Client.js";
import { sendPaymentReminder } from "../config/emailService.js";

const router = express.Router();

// 📂 Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ============================================================
   ADD CLIENT
============================================================ */
router.post(
  "/add",
  upload.fields([{ name: "invoice" }, { name: "lr" }]),
  async (req, res) => {
    try {
      const newClient = new Client({
        ...req.body, // includes name, deadline, contact, email, phone, gst, address, payment
        invoice: req.files["invoice"] ? req.files["invoice"][0].path : null,
        lr: req.files["lr"] ? req.files["lr"][0].path : null,
      });

      await newClient.save();
      res.json({ success: true, client: newClient });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

/* ============================================================
   GET ALL CLIENTS (with filter + sort)
   Example:
   /api/clients/all?payment=Paid&gst=Yes&sort=duedate
============================================================ */
router.get("/all", async (req, res) => {
  try {
    const { payment, gst, sort } = req.query;

    let filter = {};
    if (payment) filter.payment = payment; // "Paid" / "Not Paid"
    if (gst) filter.gst = gst;             // "Yes" / "No"

    let query = Client.find(filter);

    // Sorting
    if (sort === "duedate") {
      query = query.sort({ deadline: 1 }); // earliest deadline first
    }

    const clients = await query.exec();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ============================================================
   CHART DATA (Paid vs Not Paid counts)
   Example: /api/clients/chart
============================================================ */
router.get("/chart", async (req, res) => {
  try {
    const paidCount = await Client.countDocuments({ payment: "Paid" });
    const notPaidCount = await Client.countDocuments({ payment: "Not Paid" });

    res.json({
      paid: paidCount,
      notPaid: notPaidCount,
      total: paidCount + notPaidCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ============================================================
   GET SINGLE CLIENT (must be AFTER /all & /chart)
============================================================ */
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ============================================================
   UPDATE CLIENT
============================================================ */
router.put(
  "/:id",
  upload.fields([{ name: "invoice" }, { name: "lr" }]),
  async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (req.files["invoice"]) updateData.invoice = req.files["invoice"][0].path;
      if (req.files["lr"]) updateData.lr = req.files["lr"][0].path;

      const updatedClient = await Client.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedClient) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }

      res.json({ success: true, client: updatedClient });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

/* ============================================================
   DELETE CLIENT
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

/* ============================================================
   SEND PAYMENT REMINDER (Manual trigger)
   POST /api/clients/:id/send-reminder
============================================================ */
router.post("/:id/send-reminder", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const emailSent = await sendPaymentReminder(client);
    if (emailSent) {
      return res.json({ success: true, message: `Reminder sent to ${client.email}` });
    }
    return res.status(500).json({ success: false, message: "Failed to send reminder" });
  } catch (err) {
    console.error("Manual reminder error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
