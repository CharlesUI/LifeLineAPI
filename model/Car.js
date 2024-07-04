const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
  },
  pricePerHour: {
    type: String,
  },
  pricePerDay: {
    type: String,
  },
  passengerCapacity: {
    type: String,
  },
  unitsAvailable: {
    type: String,
  },
  modelYear: {
    type: String,
  },
  captainSeat: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
