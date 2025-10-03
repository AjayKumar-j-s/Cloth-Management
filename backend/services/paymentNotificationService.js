const Client = require('../models/Client');
const { sendPaymentReminder } = require('../config/emailService');

// Store the last notification dates in memory to prevent duplicate notifications
const lastNotificationDates = new Map();

const checkUnpaidClients = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find all clients with unpaid payments
        const unpaidClients = await Client.find({
            payment: "Not Paid"
        });

        console.log(`Found ${unpaidClients.length} clients with unpaid payments`);

        for (const client of unpaidClients) {
            const deadlineDate = new Date(client.deadline);
            
            // Check if payment is past deadline
            if (deadlineDate < today) {
                const lastNotified = lastNotificationDates.get(client._id.toString());
                const shouldNotify = !lastNotified || 
                    new Date(lastNotified).toDateString() !== today.toDateString();

                if (shouldNotify) {
                    // Send email reminder
                    const emailSent = await sendPaymentReminder(client);

                    if (emailSent) {
                        // Update the last notification date in memory
                        lastNotificationDates.set(client._id.toString(), new Date());
                        console.log(`Payment reminder sent to ${client.name} (${client.email})`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error checking unpaid clients:', error);
    }
};

module.exports = {
    checkUnpaidClients
};