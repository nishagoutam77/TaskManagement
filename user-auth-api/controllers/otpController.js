const twilio = require('twilio');

// Twilio configuration from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

const client = twilio(accountSid, authToken);

// Function to send OTP
exports.sendOtp = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        const verification = await client.verify.v2.services(serviceId)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });

        console.log(`OTP sent to ${phoneNumber}: Verification SID: ${verification.sid}`);
        res.status(200).json({ message: 'OTP sent successfully!', verificationSid: verification.sid });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP', error });
    }
};
