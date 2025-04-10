// ------------------------------ UTILITIES -------------------------------------

// min inclusive, max exclusive
const isInBounds = (value, min, max) => {
    return (value >= min && value < max); 
};

const getColorByNumber = (n) => {
    if (n == 1) return 'blue';
    if (n == 2) return 'green';
    if (n == 3) return 'red';
    if (n == 4) return 'darkblue';
    if (n == 5) return 'darkred';
    if (n == 6) return 'cyan';
    if (n == 7) return 'black';
    if (n == 8) return 'gray';
    if (n == 'b') return 'black';
    throw new Error("Bad call to getColorByNumber");
}

// ------------------------------ GAME CONTROLLER FUNCTIONS -------------------------------------

const updateBombCounter = (diff) => {
    const counterElement = document.getElementById('counter');
    counterElement.textContent = parseInt(counterElement.textContent) + diff;
};

const flag = (board, element) => {
    if (element.style.backgroundColor == 'lightslategray') {
        element.style.backgroundColor = 'lightcoral';
        element.textContent = '!';
        element.style.color = 'white';
        updateBombCounter(-1);
    }
    else {
        element.style.backgroundColor = 'lightslategray';
        element.textContent = '';
        updateBombCounter(1);
    }
};

const clear = (board, element) => {
    element.dataset.isClear = true;
    element.style.backgroundColor = 'white';
    const row = element.dataset.row;
    const col = element.dataset.col;
    const tileContent = board[row][col];
    if (tileContent != '0') {
        element.textContent = board[row][col];
        element.style.color = getColorByNumber(board[row][col]);
    }
};

const clearAll = (board) => {
    const elements = document.querySelectorAll('.square-button');
    elements.forEach((element) => {
        clear(board, element);
    });
}

const lose = (board) => {
    // later this function will include other actions
    // such as adding a lose message
    clearAll(board);
}

const win = (board) => {
    // todo
}

const floodFill = (board, row, col, elements) => {
    if (!isInBounds(row, 0, board.length) || !isInBounds(col, 0, board[0].length)) {
        return;
    }
    const element = elements[row * board[0].length + col];

    if (element.dataset.isClear == 'true') {
        return;
    }

    clear(board, element);

    if (board[row][col] == '0') {
            floodFill(board, row + 1, col - 1, elements);
            floodFill(board, row + 1, col, elements);
            floodFill(board, row + 1, col + 1, elements);
            floodFill(board, row, col - 1, elements);
            floodFill(board, row, col + 1, elements);
            floodFill(board, row - 1, col - 1, elements);
            floodFill(board, row - 1, col, elements);
            floodFill(board, row - 1, col + 1, elements);
        return;
    }
};

// ------------------------------ INTERNAL GAME STATE -------------------------------------

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

const countBombs = (board) => {
    // need to double reduce for 2d array
    return board.reduce((array_accumulator, row) =>
            array_accumulator + row.reduce((row_accumulator, element) =>
                                    row_accumulator + ((element == 'b') ? 1 : 0), 
                                0),
            0);
};

// ------------------------------ UI -------------------------------------

const populateUIGrid = (board) => {
    const grid = document.getElementById("minesweeperGrid");
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let newButton = document.createElement('button');
            newButton.className = "square-button";
            newButton.dataset.row = i;
            newButton.dataset.col = j;
            newButton.dataset.isClear = false;
            newButton.style.backgroundColor = 'lightslategray';

            // clearing
            newButton.addEventListener('click', () => {
                const tileContent = board[newButton.dataset.row][newButton.dataset.col];
                if (tileContent == '0') {
                    floodFill(board, parseInt(newButton.dataset.row), parseInt(newButton.dataset.col), document.querySelectorAll('.square-button'));
                }
                else if (tileContent == 'b') {
                    lose(board);
                }
                else {
                    clear(board, newButton);
                }
            });

            // flagging
            newButton.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flag(board, newButton);
            });

            grid.appendChild(newButton);
        }
    }
};

const populateBombCounter = (bombs) => {
    const grid = document.getElementById('gameTools');
    let newCounter = document.createElement('div');
    newCounter.className = 'counter';
    newCounter.id = 'counter';
    newCounter.textContent = bombs;
    grid.appendChild(newCounter);
};

// ------------------------------ MAIN -------------------------------------

const rows = 10;
const cols = 10;
const boardArray = generateBoard(rows, cols, .2);
const bombCount = countBombs(boardArray);
populateUIGrid(boardArray);
populateBombCounter(bombCount);