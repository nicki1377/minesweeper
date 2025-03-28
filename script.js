// min inclusive, max exclusive
const isInBounds = (value, min, max) => {
    return (value >= min && value < max); 
};

const flag = () => {
    // todo
}

const clearAll = (board) => {
    const elements = document.querySelectorAll('.square-button');
    elements.forEach((element) => {
        element.dataset.isClear = true;
        element.style.backgroundColor = 'white';
        const row = element.dataset.row;
        const col = element.dataset.col;
        if (board[row][col] != '0') {
            element.textContent = board[row][col];
        }
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

const floodFill = (board, row, col, elements) => {
    if (!isInBounds(row, 0, board.length) || !isInBounds(col, 0, board[0].length)) {
        return;
    }
    const element = elements[row * board[0].length + col];

    if (element.dataset.isClear == 'true') {
        return;
    }

    element.style.backgroundColor = 'white';
    element.dataset.isClear = true;

    if (board[row][col] != '0') {
        element.textContent = board[row][col];
        return;
    }
    else {
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

const populateUIGrid = (board) => {
    const grid = document.getElementById("minesweeperGrid");
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let newButton = document.createElement('button');
            newButton.className = "square-button";
            newButton.dataset.row = i;
            newButton.dataset.col = j;
            newButton.dataset.isClear = false;
            newButton.style.backgroundColor = 'blue';

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
                    newButton.style.backgroundColor = 'white';
                    newButton.textContent = board[newButton.dataset.row][newButton.dataset.col];
                }
            });

            // flagging
            newButton.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (newButton.style.backgroundColor == 'blue') {
                    newButton.style.backgroundColor = 'red';
                }
                else {
                    newButton.style.backgroundColor = 'blue';
                }
            });

            grid.appendChild(newButton);
        }
    }
};

const rows = 10;
const cols = 10;
const boardMatrix = generateBoard(rows, cols, .2);
populateUIGrid(boardMatrix);