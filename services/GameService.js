const { connection } = require('../db');
const SudokuLogic = require('../models/SudokuLogic');
const { queryAsync } = connection;

class GameService {
    getNewGame() {
        const sudoku = new SudokuLogic();
        sudoku.runGame();
        const board = sudoku.board;
        const sudokuBoard = [];
        for (let i = 0; i < board.length; i++) {
            // sudokuBoard.push(board[i].number);
            sudokuBoard.push(board[i]);
        }
        return sudokuBoard;
    }

    getGameById(id) {
        const sql = `SELECT * FROM game WHERE user_id=${id}`;
        return queryAsync(sql)
            .then((result) => result[0])
            .catch((error) => console.log('error from  getGameById:', error));
    }

    insertNewGame(id, board) {
        const json = JSON.stringify(board);
        const sql = `INSERT game(user_id, sudoku) VALUES (${id}, ?)`;
        return queryAsync(sql, [json])
            .then(() => console.log('insert new game in db'))
            .catch((error) => console.log('Error from insertNewGame:', error));
    }

    updateGame(id, board) {
        const json = JSON.stringify(board);
        const sql = `UPDATE game SET sudoku = ? WHERE user_id=${id}`;
        return queryAsync(sql, [json])
            .then(() => console.log('update'))
            .catch((error) => console.log('Error from updateGame:', error));
    }
}

module.exports = GameService;
