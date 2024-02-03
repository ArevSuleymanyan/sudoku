import Sudoku from './Sudoku.js';

function SudokuGame() {
    fetch('http://localhost:3000/api/board')
        .then((response) => response.json())
        .then((result) => init(result));

    const sudoku = new Sudoku();
    const board = sudoku.board;
    function init(json) {
        let data = JSON.parse(json);
        for (let i = 0; i < data.length; i++) {
            board[i].number = data[i].number;
            board[i].flag = data[i].flag;
        }
        createGameBoard(board);
        viewUpdate(board);
        createPossibleBoard();
        createButtons();
    }

    const cell = {
        b_id: '',
        p_id: '',
        num: '',
    };

    function createGameBoard(board) {
        let root = document.getElementById('root');
        let n = 0;
        for (let i = 0; i < 9; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < 9; j++) {
                const column = document.createElement('div');
                column.classList.add('column');
                column.setAttribute('id', n);
                column.setAttribute('type', 'text');
                if (!board[n].flag) {
                    column.classList.add('start');
                } else {
                    column.addEventListener('click', (event) =>
                        clickHandler(event)
                    );
                }

                row.append(column);
                n++;
            }
            root.append(row);
        }
    }

    function viewUpdate(board) {
        for (let i = 0; i < board.length; i++) {
            let item = document.getElementsByClassName('column')[i];
            item.innerHTML = board[i].number ? board[i].number : '';
        }
    }

    function createPossibleBoard() {
        let possible = document.getElementById('possible');
        for (let i = 0; i < 9; i++) {
            let div = document.createElement('div');
            div.classList.add('poss');
            div.setAttribute('id', `_${i}`);
            possible.append(div);
        }
    }

    function viewUpdatePossible(id) {
        let possibleNumbers = sudoku.possibleNumbers(id);
        let possibleBoard = document.getElementsByClassName('poss');
        for (const item of possibleBoard) {
            item.innerHTML = '';
        }
        for (let i = 0; i < possibleNumbers.length; i++) {
            if (possibleNumbers[i]) {
                possibleBoard[i].innerHTML = possibleNumbers[i];
                possibleBoard[i].addEventListener('click', (event) =>
                    possibleClickHandler(event)
                );
            }
        }
    }

    function clickHandler(event) {
        for (let i = 0; i < 81; i++) {
            document.getElementById(i).classList.remove('p');
        }
        document.getElementById(event.target.id).classList.remove('p');
        cell.b_id = event.target.id;
        document.getElementById(event.target.id).classList.add('p');
        viewUpdatePossible(event.target.id);
    }

    function possibleClickHandler(event) {
        cell.p_id = event.target.id;
        cell.num = document.getElementById(event.target.id).innerHTML;
        document.getElementById(event.target.id).classList.add('p');
    }

    function createButtons() {
        let btn = document.getElementById('btn');
        let add = document.createElement('button');
        let del = document.createElement('button');
        let save = document.createElement('button');

        add.innerHTML = 'ADD';
        del.innerHTML = 'DELETE';
        save.innerHTML = 'SAVE';

        add.classList.add('btn', 'btn-secondary');
        del.classList.add('btn', 'btn-secondary');
        save.classList.add('btn', 'btn-success');

        add.addEventListener('click', (event) => addNumberHandler(event));
        del.addEventListener('click', (event) => deleteNumberHandler(event));
        save.addEventListener('click', () => saveGame());

        btn.append(add, del, save);
    }

    function addNumberHandler(event) {
        if (!cell.num) {
            return;
        } else {
            board[cell.b_id].number = +cell.num;
            cell.num = 0;
            document.getElementById(cell.p_id).classList.remove('p');
            document.getElementById(cell.b_id).classList.remove('p');

            viewUpdate(board);
            viewUpdatePossible(+cell.b_id);
        }
    }

    function deleteNumberHandler(event) {
        sudoku.board[cell.b_id].number = 0;
        viewUpdate(board);
        viewUpdatePossible(+cell.b_id);
        document.getElementById(cell.p_id).classList.remove('p');
        document.getElementById(cell.b_id).classList.remove('p');
    }

    function saveGame() {
        const dataBoard = [];
        for (let i = 0; i < board.length; i++) {
            dataBoard.push(board[i]);
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataBoard),
        };
        fetch('http://localhost:3000/api/save', options)
        .then((res) => {
            if(res.redirected){
                document.location.href = 'http://localhost:3000'
            }
        });
    }
}
SudokuGame();
