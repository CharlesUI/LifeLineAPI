const CarRental = require("../model/CarRental");

// Create a new car rental
const createCarRental = async (req, res) => {
  try {
    const newCarRental = new CarRental(req.body);

    const savedCarRental = await newCarRental.save();

    res.status(201).json(savedCarRental);
  } catch (error) {
    console.error("Error creating car rental:", error.message);
    res.status(500).json({ error: "Failed to create car rental" });
  }
};

// Get rental history for a specific user
const getRentalHistory = async (req, res) => {
  try {
    const { id: userId } = req.params; // Assuming userId is passed in the request params

    const rentalHistory = await CarRental.find({ customerId: userId });

    res.status(200).json(rentalHistory);
  } catch (error) {
    console.error("Error fetching rental history:", error.message);
    res.status(500).json({ error: "Failed to fetch rental history" });
  }
};

const getAllRentals = async (req, res) => {
  try {
    const cars = await CarRental.find();
    res.json(cars);
} catch (err) {
    res.status(500).json({ message: err.message });
}
}

module.exports = {
  createCarRental,
  getRentalHistory,
  getAllRentals
};
