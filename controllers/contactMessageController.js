// src/controllers/contactController.ts
const ContactMessage = require('../model/ContactMessage')

const saveContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, message } = req.body;
    console.log(req.body)
    // Validate input (optional)
    if (!firstName || !lastName || !email || !contactNumber || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new message instance
    const newMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      contactNumber,
      message,
    });

    // Save to database
    await newMessage.save();

    // Respond with success message or saved data
    return res.status(201).json({ message: 'Message received successfully', data: newMessage });
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ error: 'Server error, message not saved' });
  }
};

module.exports = { saveContactMessage };
