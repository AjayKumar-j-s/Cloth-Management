const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Update this with your email service
    auth: {
        user: process.env.EMAIL_USER,     // Your email
        pass: process.env.EMAIL_PASSWORD  // Your email password or app-specific password
    }
});

const sendPaymentReminder = async (client) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: client.email,
            subject: 'Payment Reminder - Action Required',
            html: `
                <h2>Payment Reminder</h2>
                <p>Dear ${client.name},</p>
                <p>This is a reminder that your payment is currently marked as unpaid and has passed the deadline.</p>
                <p><strong>Client Details:</strong></p>
                <ul>
                    <li>Name: ${client.name}</li>
                    <li>Deadline: ${client.deadline}</li>
                    <li>Contact: ${client.contact}</li>
                </ul>
                <p>Please complete your payment as soon as possible. If you have already made the payment, 
                kindly inform us with the payment details.</p>
                <p>For any queries, you can reach us at:</p>
                <p>Email: ${process.env.EMAIL_USER}</p>
                <p>Thank you for your prompt attention to this matter.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendPaymentReminder
};