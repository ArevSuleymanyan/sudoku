const express = require('express');
const gameController = require('../controllers/gameController');
const router = express.Router();

router.get('/newgame', gameController.newgame);
router.get('/play', gameController.play);

module.exports = router;
