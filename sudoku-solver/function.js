document.addEventListener("DOMContentLoaded", function () {
    
let sudo = document.getElementById("sudoku");
let solve = document.getElementById("solve");
let generate = document.getElementById("generate");
let clearBoard = document.getElementById("clear");
let result = document.getElementById("sudoku-status");
let user = document.getElementById("user");


let solved = false;
let f1 = true;

let board = [];

function makeBoard() {
    board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
}

function cleanBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let sudokuCell = document.getElementById(`cell-${i}-${j}`);
            if (board[i][j] != 0) {
                sudokuCell.classList.remove("given-num");
                sudokuCell.classList.add("discovered-num");
                board[i][j] = 0;
                sudokuCell.innerText = "";
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    makeBoard();
    sudokuMaker();
    setEditable(true);
    remove();
});

function sudokuMaker() {
    while (sudo.firstChild) {
        sudo.removeChild(sudo.firstChild);
    }

    for (let i = 0; i < 9; i++) {
        let sudokuRow = document.createElement("tr");
        sudo.appendChild(sudokuRow);

        for (let j = 0; j < 9; j++) {
            let sudokuCell = document.createElement("td");
            sudokuRow.appendChild(sudokuCell);
            let num = board[i][j];
            sudokuCell.id = `cell-${i}-${j}`;

            let sudokuValue = document.getElementById(`cell-${i}-${j}`);

            if (num !== 0) {
                sudokuValue.innerText = num;
                sudokuCell.classList.add('given-num');
            } else {
                sudokuCell.classList.add('discovered-num');
            }

            if (i === 2 || i === 5) {
                sudokuCell.classList.add('box-boundary-row');
            }
            if (j === 2 || j === 5) {
                sudokuCell.classList.add('box-boundary-col');
            }

            if (i == 3 || i == 4 || i == 5 || j == 3 || j == 4 || j == 5) {
                sudokuCell.classList.add('gray-box');
            }
        }
    }
}

function setEditable(editable) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            let currentCell = document.getElementById(`cell-${i}-${j}`);
            currentCell.contentEditable = editable;

            currentCell.addEventListener('keydown', evt => {
                let [row, col] = evt.target.id.match(/\d/g).map(num => parseInt(num));
                let input = parseInt(evt.key);

                if (evt.target.textContent.length > 0 || isNaN(input)) {
                    if (evt.key === 'Backspace') {
                        evt.target.classList.remove('given-num');
                        evt.target.classList.add('discovered-num');
                        board[row][col] = 0;
                    } else {
                        evt.preventDefault();
                    }
                } else {
                    if (isPossible(board, row, col, input)) {
                        evt.target.classList.remove('discovered-num');
                        evt.target.classList.add('given-num');
                        board[row][col] = input;
                    } else {
                        evt.preventDefault();
                    }
                }
            });

            currentCell.addEventListener('focusin', evt => {
                let [row, col] = evt.target.id.match(/\d/g).map(num => parseInt(num));
                let rowStart = row - row % 3;
                let rowEnd = rowStart + 3;
                let colStart = col - col % 3;
                let colEnd = colStart + 3;

                for (let i = 0; i < board[row].length; i++) {
                    let cellRow = document.getElementById(`cell-${row}-${i}`);
                    let cellCol = document.getElementById(`cell-${i}-${col}`);
                    cellRow.classList.add('focused-cell');
                    cellCol.classList.add('focused-cell');
                }

                for (let x = rowStart; x < rowEnd; x++) {
                    for (let y = colStart; y < colEnd; y++) {
                        let cellBox = document.getElementById(`cell-${x}-${y}`);
                        cellBox.classList.add('focused-cell');
                    }
                }
            });

            currentCell.addEventListener('focusout', evt => {
                let [row, col] = evt.target.id.match(/\d/g).map(num => parseInt(num));
                let rowStart = row - row % 3;
                let rowEnd = rowStart + 3;
                let colStart = col - col % 3;
                let colEnd = colStart + 3;

                for (let i = 0; i < board[row].length; i++) {
                    let cellRow = document.getElementById(`cell-${row}-${i}`);
                    let cellCol = document.getElementById(`cell-${i}-${col}`);
                    cellRow.classList.remove('focused-cell');
                    cellCol.classList.remove('focused-cell');
                }

                for (let x = rowStart; x < rowEnd; x++) {
                    for (let y = colStart; y < colEnd; y++) {
                        let cellBox = document.getElementById(`cell-${x}-${y}`);
                        cellBox.classList.remove('focused-cell');
                    }
                }
            });
        }
    }
}

solve.addEventListener("click", function () {
    let solvable = true;
    isCancel = false;
    setEditable(false);

    if (solvable) {
        solved = false;
        checkStatus();
        console.log(board);
    } else {
        alert("empty sudoku !");
    }
});

async function checkStatus() {
    let game = await sudokuSolver(board, 0, 0)
    if (game == true) {
        result.classList.add("status-solved");
        result.innerText = "Solved !";
        console.log("working");
    } else if (game == false) {
        result.classList.add("status-unsolved");
        result.innerText = "Unsolvable !";
        console.log("working");
    }
}

function remove() {
    result.innerText = "";
    if (result.classList.contains("status-solved")) {
        result.classList.remove("status-solved");
    }
    if (result.classList.contains("status-unsolved")) {
        result.classList.remove("status-unsolved");
    }
}

let ms = 2;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let isCancel = false;

async function sudokuSolver(board, row, col) {
    if (isCancel) {
        return;
    }

    if (solved) {
        return true;
    }

    if (col == 9) {
        row++;
        col = 0;
    }

    if (row == 9) {
        solved = true;
        return true;
    }
    if (board[row][col] != 0) {
        return await sudokuSolver(board, row, col + 1);
    } else {
        for (let val = 1; val <= 9; val++) {
            if (isPossible(board, row, col, val)) {
                await sleep(ms);

                board[row][col] = val;
                document.getElementById(`cell-${row}-${col}`).innerText = val;

                let next = await sudokuSolver(board, row, col + 1);
                if (next) {
                    return true;
                } else {
                    board[row][col] = 0;
                    document.getElementById(`cell-${row}-${col}`).innerText = "";
                }
            }
        }
        return false;
    }
}

function isPossible(board, row, col, val) {
    for (let i = 0; i < board.length; i++) {
        if (board[row][i] == val) {
            return false;
        }
        if (board[i][col] == val) {
            return false;
        }
    }

    let boxRow = row - row % 3;
    let boxCol = col - col % 3;

    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (board[r][c] == val) {
                return false;
            }
        }
    }

    return true;
}

generate.addEventListener("click", function () {
    cleanBoard();
    console.log("Generate button clicked");
    setEditable(true);
    generateHelper();
});

function generateHelper() {
    makeBoard();
    console.log("Generating Sudoku board");

    let findEmpty = (board) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    let fillBoard = (board) => {
        let empty = findEmpty(board);
        if (!empty) {
            return true;
        }

        let [row, col] = empty;
        let numbers = [...Array(9).keys()].map(i => i + 1);
        numbers.sort(() => Math.random() - 0.5);

        for (let num of numbers) {
            if (isPossible(board, row, col, num)) {
                board[row][col] = num;
                if (fillBoard(board)) {
                    return true;
                }
                board[row][col] = 0;
            }
        }
        return false;
    }

    let removeNumbers = (board, attempts = 5) => {
        while (attempts > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            while (board[row][col] === 0) {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            }

            let backup = board[row][col];
            board[row][col] = 0;

            let copyBoard = board.map(arr => arr.slice());
            if (!fillBoard(copyBoard)) {
                board[row][col] = backup;
                attempts--;
            }
        }
    }

    fillBoard(board);
    removeNumbers(board, 50);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let sudokuCell = document.getElementById(`cell-${i}-${j}`);
            if (board[i][j] != 0) {
                sudokuCell.innerText = board[i][j];
                sudokuCell.classList.remove("discovered-num");
                sudokuCell.classList.add("given-num");
            } else {
                sudokuCell.innerText = "";
                sudokuCell.classList.remove("given-num");
                sudokuCell.classList.add("discovered-num");
            }
        }
    }
}

clearBoard.addEventListener("click", function () {
    cleanBoard();
});

home.addEventListener("click", function () {
    console.log("clicked");
    window.location.href = "/home";
});

user.addEventListener("click", function () {
    console.log("clicked");
    window.location.href = "/users";
});
});