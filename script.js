// ------------------------------ UTILITIES -------------------------------------
const bombIcon = '\u{1F4A3}';
const explosionIcon = '\u{1F4A5}';
const uniSmiley = '\u{263A}';

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

const toElementIndex = (row, col, board) => {
    return row * board[0].length + col;
}

// ------------------------------ GAME CONTROLLER FUNCTIONS -------------------------------------

const updateBombCounter = (diff) => {
    const counterElement = document.getElementById('counter');
    counterElement.textContent = parseInt(counterElement.textContent) + diff;
};

const flag = (board, element) => {
    if (element.dataset.isClear == 'true') {
        return;
    }
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
    if (element.dataset.isClear == 'true') {
        return;
    }
    element.dataset.isClear = true;
    element.style.backgroundColor = 'white';
    element.style.cursor = 'default';
    const row = element.dataset.row;
    const col = element.dataset.col;
    const tileContent = board[row][col];
    if (tileContent == 'b') {
        element.textContent = bombIcon;
    }
    else if (tileContent == '0') {
        floodFill(board, parseInt(element.dataset.row), parseInt(element.dataset.col), document.querySelectorAll('.square-button'));
    }
    else {
        element.textContent = board[row][col];
        element.style.color = getColorByNumber(board[row][col]);
    }
};

const clearByIndex = (board, row, col) => {
    if (!isInBounds(row, 0, board.length) || !isInBounds(col, 0, board[0].length)) {
        return;
    }
    clear(board, document.querySelectorAll('.square-button')[toElementIndex(row, col, board)]);
}

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
    bombToSmiley();
}

const floodFill = (board, row, col, elements) => {
    clearByIndex(board, row + 1, col - 1);
    clearByIndex(board, row + 1, col);
    clearByIndex(board, row + 1, col + 1);
    clearByIndex(board, row, col - 1);
    clearByIndex(board, row, col + 1);
    clearByIndex(board, row - 1, col - 1);
    clearByIndex(board, row - 1, col);
    clearByIndex(board, row - 1, col + 1);
};

// ------------------------------ TIMER -------------------------------------

const startTimer = () => {
    let minute = 0;
    let second = 0;
    const timer = document.getElementById('timer');
    const id = setInterval((() => {
        second = second + 1;
        if (second == 60) {
            second = 0;
            minute = minute + 1;
        }
        updateTimerUI(minute, second, timer);
    }), 1000);
    return id;
}

const stopTimer = (id) => {
    clearInterval(id);
}

// im gonna assume nobody is playing this for an hour+
const updateTimerUI = (minute, second, timer) => {
    timer.textContent = String(minute).padStart(2, '0') + ":" + String(second).padStart(2, '0');
}

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

const generateBoard = (rows, cols, percentageBomb, startRow, startCol) => {
    let board = new Array(rows);
    for (let i = 0; i < rows; i++) {
        board[i] = new Array(cols).fill(0);
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const randomNumber = Math.random();
            if (randomNumber <= percentageBomb && 
                !(i <= startRow + 1 && i >= startRow - 1 && j <= startCol + 1 && j >= startCol - 1)) {
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

const bombToSmiley = () => {
    const elements = document.querySelectorAll('.square-button');
    elements.forEach((element) => {
        // this should only get called at game end, so any non-clear tile will be a bomb tile
        if (!element.dataset.isClear) {
            element.textContent = uniSmiley;
        }
    });
};

const enableGameFunctions = (board) => {
    const elements = document.querySelectorAll('.square-button');
    const id = startTimer();
    elements.forEach((element) => {
        element.addEventListener('click', () => {
            const tileContent = board[element.dataset.row][element.dataset.col];
            if (tileContent == 'b') {
                lose(board);
                stopTimer(id);
            }
            else {
                clear(board, element);
            }
        }, {once: true});

        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            flag(board, element);
        });
    });
};

const updateGameMode = (board) => {
    const parent = document.getElementById('gameBanner');
    document.getElementById('start').remove();

    let newTools = document.createElement('div');
    newTools.id = 'gameTools';
    newTools.className = 'gameTools';
    parent.appendChild(newTools)
    
    let newText = document.createElement('div');
    newText.id = 'remaining';
    newText.className = 'counter';
    newText.textContent = 'Remaining: ';
    newText.style.gridColumnStart = 'line0';
    newText.style.gridColumnEnd = 'line1';
    newTools.appendChild(newText);
    
    populateBombCounter(countBombs(board));
    
    let newTimer = document.createElement('div');
    newTimer.id = 'timer';
    newTimer.className = 'counter';
    newTimer.textContent = '00:00';
    newTimer.style.gridColumnStart = 'line3';
    newTimer.style.gridColumnEnd = 'line4';
    newTimer.style.alignContent = 'end';
    newTools.appendChild(newTimer);
};

const populateBombCounter = (bombs) => {
    const grid = document.getElementById('gameTools');
    let newCounter = document.createElement('div');
    newCounter.id = 'counter';
    newCounter.className = 'counter';
    newCounter.textContent = bombs;
    newCounter.style.gridColumnStart = 'line1';
    newCounter.style.gridColumnEnd = 'line2';
    grid.appendChild(newCounter);
};

const populateUIGrid = (rows, cols) => {
    const grid = document.getElementById("minesweeperGrid");
    const controller = new AbortController();
    const signal = controller.signal;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let newButton = document.createElement('button');
            newButton.className = "square-button";
            newButton.dataset.row = i;
            newButton.dataset.col = j;
            newButton.dataset.isClear = false;
            newButton.style.backgroundColor = 'lightslategray';

            newButton.addEventListener('click', function firstClick() {
                const board = generateBoard(rows, cols, .2, i, j);
                clear(board, newButton);
                controller.abort();
                updateGameMode(board);
                enableGameFunctions(board);
            }, {signal});

            grid.appendChild(newButton);
        }
    }
};

// ------------------------------ MAIN -------------------------------------

const rows = 10;
const cols = 10;
populateUIGrid(rows, cols);