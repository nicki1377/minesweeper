const updateAdjacentCount = (arr, x, y) => {
    let sizeX = arr.length;
    let sizeY = arr[0].length;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < sizeX && j >= 0 && j < sizeY) {
                if (arr[i][j] != 'b') {
                    arr[i][j] += 1;
                }
            }
        }
    }
};

const generateBoard = (rows, cols, percentageBomb) => {
    let boardMatrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
        boardMatrix[i] = new Array(cols).fill(0);
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const randomNumber = Math.random();
            if (randomNumber <= percentageBomb) {
                boardMatrix[i][j] = 'b';
                updateAdjacentCount(boardMatrix, i, j);
            }
        }
    }
    return boardMatrix;
};

const floodFill = (boardMatrix, element, elements) => {
    const row = parseInt(element.dataset.row);
    const col = parseInt(element.dataset.col);
    if (element.dataset.isClear == 'true' || boardMatrix[row][col] != '0') {
        return;
    }
    else {
        element.style.backgroundColor = 'white';
        element.dataset.isClear = true;
        if (col + 1 < boardMatrix[0].length) {
            floodFill(boardMatrix, elements[row * boardMatrix[0].length + col + 1], elements);
        }
        if (col - 1 >= 0) {
            floodFill(boardMatrix, elements[row * boardMatrix[0].length + col - 1], elements);
        }
        if (row + 1 < boardMatrix.length) {
            floodFill(boardMatrix, elements[(row + 1) * boardMatrix[0].length + col], elements);
        }
        if (row - 1 >= 0) {
            floodFill(boardMatrix, elements[(row - 1) * boardMatrix[0].length + col], elements);
        }
        return;
    }
};

// i do wonder if maybe we should just store the values in the DOM element
// but perhaps not. idek.

const populateUIGrid = () => {
    const grid = document.getElementById("minesweeperGrid");
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let newButton = document.createElement('button');
            newButton.className = "square-button";
            newButton.dataset.row = i;
            newButton.dataset.col = j;
            newButton.dataset.isClear = false;
            document.getElementById('minesweeperGrid').appendChild(newButton);
        }
    }

    const elements = document.querySelectorAll('.square-button');
    elements.forEach((element) => {
        element.addEventListener('click', () => {
            const tileContent = boardMatrix[element.dataset.row][element.dataset.col];
            if (tileContent == '0') {
                floodFill(boardMatrix, element, elements);
            }
            else {
                element.style.backgroundColor = 'white';
                element.textContent = boardMatrix[element.dataset.row][element.dataset.col];
            }
        });
    });
};

const rows = 10;
const cols = 10;
const boardMatrix = generateBoard(rows, cols, .1);
populateUIGrid();