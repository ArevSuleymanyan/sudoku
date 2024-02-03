const express = require('express');
const GameService = require('../services/GameService');

const router = express.Router();
const gameService = new GameService();

router.get('/board', async (request, response) => {
    const id = request.userInfo.id;
    let game = await gameService.getGameById(id);
    const board = game.sudoku;
    response.status(200).json(board);
});

router.post('/save', async (request, response) => {
    const data = request.body;
    await gameService.updateGame(request.userInfo.id, data);
    return response.status(200).redirect('/');
});

module.exports = router;
