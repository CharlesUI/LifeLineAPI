const mongoose = require("mongoose");

const carRentalSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // Assuming you have a Customer model
    required: true,
  },
  carDetails: {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car", // Assuming you have a Car model
      required: true,
    },
    brand: String,
    modelYear: String,
    image: String,
    pricePerHour: String,
    pricePerDay: String,
    passengerCapacity: String,
    unitsAvailable: String,
    captainSeat: String,
  },
  rentalDuration: {
    type: String,
    required: true,
  },
  paymentOption: {
    type: String,
    enum: ["creditCard", "gcash"], // Assuming these are the payment options
    required: true,
  },
  totalPrice: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CarRental = mongoose.model("CarRental", carRentalSchema);

module.exports = CarRental;
