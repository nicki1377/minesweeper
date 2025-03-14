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

const populateUIGrid = () => {
    const grid = document.getElementById("minesweeperGrid");
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let newButton = document.createElement('button');
            newButton.className = "square-button";
            newButton.dataset.row = i;
            newButton.dataset.col = j;
            document.getElementById('minesweeperGrid').appendChild(newButton);
        }
    }

    const elements = document.querySelectorAll('.square-button');
    elements.forEach((element) => {
        element.addEventListener('click', () => {
            element.style.backgroundColor = 'white';
            element.textContent = boardMatrix[element.dataset.row][element.dataset.col];
        });
    });
};

const rows = 10;
const cols = 10;
const boardMatrix = generateBoard(rows, cols, .1);
populateUIGrid();