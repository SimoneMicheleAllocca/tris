const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const resultModal = document.getElementById('resultModal');
const resultMessage = document.getElementById('resultMessage');
const restartModalButton = document.getElementById('restartModalButton');
let gameActive = true;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let difficulty = 'easy';

document.getElementById('difficulty').addEventListener('change', (event) => {
    difficulty = event.target.value;
});

cells.forEach(cell => cell.addEventListener('click', cellClick));
restartButton.addEventListener('click', restartGame);
restartModalButton.addEventListener('click', restartGame);

function cellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
    if (gameActive) {
        computerMove();
    }
}

function computerMove() {
    const emptyCells = gameState.map((state, index) => state === '' ? index : null).filter(index => index !== null);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const chosenCellIndex = emptyCells[randomIndex];

    if (difficulty === 'hard') {
        const winningMove = checkWinningMove();
        if (winningMove !== null) {
            gameState[winningMove] = 'O';
            cells[winningMove].textContent = 'O';
            checkResult();
            return;
        }
    }

    if (chosenCellIndex !== undefined) {
        gameState[chosenCellIndex] = 'O';
        cells[chosenCellIndex].textContent = 'O';
        checkResult();
    }
}

function checkWinningMove() {
    for (let i = 0; i < 3; i++) {
        const row = [i * 3, i * 3 + 1, i * 3 + 2];
        const col = [i, i + 3, i + 6];
        if (checkLine(row, 'X')) return row.find(index => gameState[index] === '');
        if (checkLine(col, 'X')) return col.find(index => gameState[index] === '');
    }

    const diagonals = [[0, 4, 8], [2, 4, 6]];
    for (const diag of diagonals) {
        if (checkLine(diag, 'X')) return diag.find(index => gameState[index] === '');
    }

    return null;
}

function checkLine(indices, player) {
    return indices.every(index => gameState[index] === player);
}

function checkResult() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            gameActive = false;
            resultMessage.textContent = `${gameState[a]} ha vinto!`;
            showModal();
            return;
        }
    }

    if (!gameState.includes('')) {
        gameActive = false;
        resultMessage.textContent = 'Pareggio!';
        showModal();
    }
}

function showModal() {
    $(resultModal).modal('show');
}

function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    statusDisplay.textContent = '';
    $(resultModal).modal('hide');
}
