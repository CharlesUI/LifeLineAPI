const express = require('express');
const router = express.Router();
const {
  changePassword,
  loginClient,
  registerClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

router.route('/register').post(registerClient)
router.route('/login').post(loginClient)
router.route('/').get(getAllClients)
router.route('/:id').get(getClientById).patch(updateClient).delete(deleteClient)
router.route('/change-password/:id').post(changePassword)

module.exports = router;