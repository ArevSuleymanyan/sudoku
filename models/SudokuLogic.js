class SudokuLogic {
    constructor() {
        this.resetData();
    }

    resetData() {
        this.board = [];
        for (let i = 0; i < 81; i++) {
            this.board.push({
                flag: false,
                number: 0,
            });
        }
    }

    runGame(lvl = 3) {
        this.getNumberByLevel(lvl);
    }

    // updateBoard(input, i, j) {
    //     let index = j * 9 + i;
    //     if (this.check(input, i, j)) {
    //         this.board[index].number = input;
    //     }
    // }

    checkEndGame() {
        for (let item of this.board) {
            if (!item.number) {
                return true;
            }
        }
        return false;
    }

    getNumberByLevel(level) {
        let countOfNumbers;
        if (level === 3) {
            countOfNumbers = 40;
            this.generateNumber();
        } else if (level === 2) {
            countOfNumbers = 30;
            this.generateNumber();
        } else if (level === 1) {
            countOfNumbers = 25;
            this.generateNumber();
        }

        while (countOfNumbers < 81) {
            let randomIndex = Math.floor(Math.random() * 81);
            if (this.board[randomIndex].number) {
                this.board[randomIndex].flag = true
                this.board[randomIndex].number = 0;
                countOfNumbers++;
            }
        }
    }

    possibleNumbers(index) {
        let init = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let possible = [];
        for (let item of init) {
            if (this.check(item, index)) {
                possible.push(item);
            }
        }
        return possible;
    }

    generateNumber(attempts) {
        if (!attempts) {
            attempts = 2000;
        }
        this.resetData();
        for (let i = 0; i < 81; i++) {
            let possible = this.possibleNumbers(i);
            if (!possible.length) {
                this.resetData();
                i = -1;
                attempts--;
                if (attempts == 0) {
                    throw 'Cant generate';
                }
                continue;
            }
            let rnd = Math.floor(Math.random() * possible.length);
            this.board[i].number = possible[rnd];
            //this.print()
        }
    }

    check(number, index) {
        if (
            this.checkVertical(number, index) &&
            this.checkHorizontal(number, index) &&
            this.checkMatrix(number, index)
        ) {
            return true;
        } else {
            return false;
        }
    }

    checkVertical(number, index) {
        for (let i = 0; i < this.board.length; i++) {
            if (i % 9 === index % 9 && this.board[i].number === number) {
                return false;
            }
        }
        return true;
    }

    checkHorizontal(number, index) {
        for (let i = 0; i < this.board.length; i++) {
            if (
                parseInt(i / 9) === parseInt(index / 9) &&
                this.board[i].number === number
            ) {
                return false;
            }
        }
        return true;
    }

    checkMatrix(number, index) {
        let segmentX = parseInt((index % 9) / 3) * 3;
        let segmentY = parseInt(parseInt(index / 9) / 3) * 3;

        for (let s = 0; s < this.board.length; s++) {
            for (let k = segmentX; k < segmentX + 3; k++) {
                for (let p = segmentY; p < segmentY + 3; p++) {
                    if (
                        s % 9 === k &&
                        parseInt(s / 9) === p &&
                        this.board[s].number === number
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    print() {
        let res = '';
        for (let i = 0; i < 81; i++) {
            const item = this.board[i];
            if (i % 9 === 0) {
                res += '\n';
            }
            res += item.number.toString();
        }
        console.log(res);
    }
}

if (module) {
    module.exports = SudokuLogic;
}
