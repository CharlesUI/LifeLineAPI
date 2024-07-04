// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { postComment, getAllComments } = require('../controllers/commentController');

// POST request to save a new comment

router.route('/').post(postComment).get(getAllComments)

module.exports = router;
