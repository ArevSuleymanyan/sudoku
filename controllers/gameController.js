const GameService = require('../services/GameService');
const gameService = new GameService();


exports.newgame = async (request, response) => {
    const id = request.userInfo.id;
    const name = request.userInfo.name;
    let game = await gameService.getGameById(id);
    let board = gameService.getNewGame();

    if (!game) {
        await gameService.insertNewGame(id, board);
    } else {
        await gameService.updateGame(id, board);
    }

    game = await gameService.getGameById(id);

    response.render('game', {
        name,
    })
};

exports.play = async (request, response) => {
    const id = request.userInfo.id;
    const name = request.userInfo.name;
    let game = await gameService.getGameById(id);
    if (!game) {
        const board = gameService.getNewGame();
        gameService.insertNewGame(id, board);
        // let game = await gameService.getGameById(id);
        response.render('game', {
            name,
        });
    }
    response.render('game', {
        name,
    });
};
