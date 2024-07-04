// src/routes/contactRoutes.ts

const express = require('express');
const router = express.Router();
const { saveContactMessage } = require('../controllers/contactMessageController');


// Route to handle contact form submissions
router.route('/').post(saveContactMessage)

module.exports = router
