const express = require('express')
const router = express.Router()

const { register, login, getAdmins, deleteAdmin, updateAdmin } = require('../controllers/adminControllers')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/').get(getAdmins)
router.route('/:id').delete(deleteAdmin).patch(updateAdmin)

module.exports = router