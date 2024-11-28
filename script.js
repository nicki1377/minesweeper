
// board array generation
// probably make this its own function too
let rows = 5;
let cols = 5;
let dynamicMatrix = new Array(rows);
let percentageBomb = .1;
for (let i = 0; i < rows; i++) {
    dynamicMatrix[i] = new Array(cols).fill(0); // Fill each row with zeros
    for (let j = 0; j < cols; j++) {
        let randomNumber = Math.random();
        if (randomNumber <= percentageBomb) {
            dynamicMatrix[i][j] = 'b';
        }
    }
}

// put in function 'populateGrid'
var width = 5;
var height = 5;
const grid = document.getElementById("minesweeperGrid");
for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
        let newButton = document.createElement('button');
        newButton.className = "square-button";
        newButton.dataset.row = i;
        newButton.dataset.col = j;
        document.getElementById('minesweeperGrid').appendChild(newButton);
    }
}

const elements = document.querySelectorAll('.square-button');
elements.forEach((element) => {
    element.addEventListener('click', function() {
        element.style.backgroundColor = 'white';
        element.textContent = dynamicMatrix[element.dataset.row][element.dataset.col];
    });
});