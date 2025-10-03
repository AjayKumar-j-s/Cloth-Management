import express from 'express';
import Client from '../models/Client.js';

const router = express.Router();

// Test route to get client by ID
router.get('/client/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error finding client:', error);
        res.status(500).json({ error: 'Failed to find client' });
    }
});

// Test route to send email notification
router.post('/send-notification/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const { sendPaymentReminder } = await import('../config/emailService.js');
        const emailSent = await sendPaymentReminder(client);

        if (emailSent) {
            res.json({ 
                message: `Test email sent successfully to ${client.email}`,
                clientDetails: {
                    name: client.name,
                    email: client.email,
                    payment: client.payment,
                    deadline: client.deadline
                }
            });
        } else {
            res.status(500).json({ error: 'Failed to send test email' });
        }
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ error: `Failed to send test email: ${error.message}` });
    }
});

// Test route to check all unpaid clients
router.get('/unpaid-clients', async (req, res) => {
    try {
        const unpaidClients = await Client.find({ payment: "Not Paid" });
        res.json({
            count: unpaidClients.length,
            clients: unpaidClients.map(client => ({
                id: client._id,
                name: client.name,
                email: client.email,
                deadline: client.deadline
            }))
        });
    } catch (error) {
        console.error('Error getting unpaid clients:', error);
        res.status(500).json({ error: 'Failed to get unpaid clients' });
    }
});

export default router;