const express = require("express");
const router = express.Router();
const { createCarRental, getRentalHistory, getAllRentals } = require("../controllers/carRentalController");

// POST request to create a new car rental
router.route('/').post(createCarRental).get(getAllRentals)
router.route('/history/:id').get(getRentalHistory)

module.exports = router;
