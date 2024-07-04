// controllers/carController.js

const Car = require('../model/Car');

// Get all cars
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get car by ID
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new car
const createCar = async (req, res) => {
    const car = new Car({
        brand: req.body.brand,
        pricePerHour: req.body.pricePerHour,
        pricePerDay: req.body.pricePerDay,
        passengerCapacity: req.body.passengerCapacity,
        unitsAvailable: req.body.unitsAvailable,
        modelYear: req.body.modelYear,
        captainSeat: req.body.captainSeat
    });
    try {
        const newCar = await car.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update car by ID
const updateCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        if (req.body.brand != null) car.brand = req.body.brand;
        if (req.body.pricePerHour != null) car.pricePerHour = req.body.pricePerHour;
        if (req.body.pricePerDay != null) car.pricePerDay = req.body.pricePerDay;
        if (req.body.passengerCapacity != null) car.passengerCapacity = req.body.passengerCapacity;
        if (req.body.unitsAvailable != null) car.unitsAvailable = req.body.unitsAvailable;
        if (req.body.modelYear != null) car.modelYear = req.body.modelYear;
        if (req.body.captainSeat != null) car.captainSeat = req.body.captainSeat;

        const updatedCar = await car.save();
        res.json(updatedCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete car by ID
const deleteCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        await car.remove();
        res.json({ message: 'Car deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllCars,
    getCarById,
    createCar,
    updateCarById,
    deleteCarById
}
