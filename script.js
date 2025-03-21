// min inclusive, max exclusive
const isInBounds = (value, min, max) => {
    return (value >= min && value < max); 
};

const updateAdjacentCount = (arr, x, y) => {
    let sizeX = arr.length;
    let sizeY = arr[0].length;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (isInBounds(i, 0, sizeX) && isInBounds(j, 0, sizeY)) {
                if (arr[i][j] != 'b') {
                    arr[i][j] += 1;
                }
            }
        }
    }
};

const generateBoard = (rows, cols, percentageBomb) => {
    let board = new Array(rows);
    for (let i = 0; i < rows; i++) {
        board[i] = new Array(cols).fill(0);
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const randomNumber = Math.random();
            if (randomNumber <= percentageBomb) {
                board[i][j] = 'b';
                updateAdjacentCount(board, i, j);
            }
        }
    }
    return board;
};

const floodFill = (board, element, elements) => {
    const row = parseInt(element.dataset.row);
    const col = parseInt(element.dataset.col);
    if (element.dataset.isClear == 'true') {
        return;
    }
    else if (board[row][col] != '0') {
        element.style.backgroundColor = 'white';
        element.dataset.isClear = true;
        element.textContent = board[row][col];
        return;
    }
    else {
        element.style.backgroundColor = 'white';
        element.dataset.isClear = true;
        if (col + 1 < board[0].length) {
            floodFill(board, elements[row * board[0].length + col + 1], elements);
        }
        if (col - 1 >= 0) {
            floodFill(board, elements[row * board[0].length + col - 1], elements);
        }
        if (row + 1 < board.length) {
            floodFill(board, elements[(row + 1) * board[0].length + col], elements);
        }
        if (row - 1 >= 0) {
            floodFill(board, elements[(row - 1) * board[0].length + col], elements);
        }
        return;
    }
};

const populateUIGrid = (board) => {
    const grid = document.getElementById("minesweeperGrid");
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let newButton = document.createElement('button');
            newButton.className = "square-button";
            newButton.dataset.row = i;
            newButton.dataset.col = j;
            newButton.dataset.isClear = false;

            newButton.addEventListener('click', () => {
                const tileContent = board[newButton.dataset.row][newButton.dataset.col];
                if (tileContent == '0') {
                    floodFill(board, newButton, document.querySelectorAll('.square-button'));
                }
                else {
                    newButton.style.backgroundColor = 'white';
                    newButton.textContent = board[newButton.dataset.row][newButton.dataset.col];
                }
            });
            grid.appendChild(newButton);
        }
    }
};

const rows = 10;
const cols = 10;
const boardMatrix = generateBoard(rows, cols, .1);
populateUIGrid(boardMatrix);