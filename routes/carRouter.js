const express = require('express');
const router = express.Router();

const {
    getAllCars,
    getCarById,
    createCar,
    updateCarById,
    deleteCarById
} = require('../controllers/carController')

router.route('/').get(getAllCars).post(createCar)
router.route('/:id').get(getCarById).patch(updateCarById).delete(deleteCarById)

module.exports = router;
