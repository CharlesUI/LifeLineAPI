const express = require('express');
const router = express.Router();
const {
  changePassword,
  loginPlayer,
  getAllPlayers,
  getPlayerById,
  registerPlayer,
  updatePlayer,
  deletePlayer,
} = require('../controllers/playerController');

router.route('/register').post(registerPlayer)
router.route('/login').post(loginPlayer)
router.route('/').get(getAllPlayers)
router.route('/:id').get(getPlayerById).patch(updatePlayer).delete(deletePlayer)
router.route('/change-password/:id').post(changePassword)

module.exports = router;