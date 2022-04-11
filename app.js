// GENERAL-PURPOSE GAME OBJECTS
let lookingForWhereToGo;
let gameActive = true;
let initialGame = true;
let successfulMove = false;
let wins = 0;
let losses = 0;
let currentScore = 0;
let highScore = 0;

// Array representing the values at each square
let gameArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
]

document.addEventListener('keydown', (e) => {
    if (gameActive === false) keepPlaying()

    if (e.code === 'ArrowLeft') moveLeft()
    else if (e.code === 'ArrowRight') moveRight()
    else if (e.code === 'ArrowUp') moveUp()
    else if (e.code === 'ArrowDown') moveDown()
})

// GENERAL-PURPOSE FUNCTIONS
function positionPiece(piece, row, column) {
    $(piece).css( {'top': `${row * 100}px`, 'left': `${column * 100}px`})
}

function move(pieceToMove, oldRow, oldColumn, newRow, newColumn) {
    lookingForWhereToGo = false;
    successfulMove = true;
    pieceToMove.classList.replace(`r${oldRow}c${oldColumn}`, `r${newRow}c${newColumn}`);
    gameArray[newRow][newColumn] = gameArray[oldRow][oldColumn];
    gameArray[oldRow][oldColumn] = 0;
    positionPiece(pieceToMove, newRow, newColumn);
}

function combine(pieceToMove, oldRow, oldColumn, newRow, newColumn) {
    lookingForWhereToGo = false
    successfulMove = true;

    // Remove the existing piece
    let existingPiece = document.querySelector(`.r${newRow}c${newColumn}`)
    existingPiece.remove()

    // Move the new piece
    pieceToMove.classList.replace(`r${oldRow}c${oldColumn}`, `r${newRow}c${newColumn}`)
    positionPiece(pieceToMove, newRow, newColumn)
    gameArray[oldRow][oldColumn] = 0

    // Double value of remaining piece
    let newValue = gameArray[newRow][newColumn] * 2
    pieceToMove.classList.replace(`v${newValue / 2}`, `v${newValue}`)
    $(pieceToMove).text(newValue)
    gameArray[newRow][newColumn] = newValue

    currentScore += newValue
    if (currentScore > highScore) highScore = currentScore
    $('.scoreboard').text(`Current Score: ${currentScore} | High Score: ${highScore}`)
}

// FUNCTIONS TO MOVE IN EACH DIRECTION

function moveLeft() {

    for (let r = 0; r < 4; r++) { // Look at each row
        for (let c = 1; c < 4; c++) { // Look at the latter three columns

            if (gameArray[r][c] > 0) { // Find the leftmost piece that's potentially moveable
                let pieceToMove = document.querySelector(`.r${r}c${c}`)
                lookingForWhereToGo = true;

                for (let delta = 1; c - delta > -2 && lookingForWhereToGo; delta++) { // Start looking to its left...

                    // If you find the end of the board, move next to it if possible
                    if (c - delta < 0) {
                        if (delta > 1 && gameArray[r][0] === 0) {
                            move(pieceToMove, r, c, r, c - delta + 1)
                        }
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r][c - delta] === gameArray[r][c]) {
                        combine(pieceToMove, r, c, r, c - delta)
                    
                    // If you find a piece of a different value, move next to it if possible
                    } else if (gameArray[r][c - delta] > 0) {
                        if (delta > 1 && gameArray[r][c - delta + 1] === 0) {
                            move(pieceToMove, r, c, r, c - delta + 1)
                        }
                    }
                }
            }
        }
    }
    if (initialGame) checkScore()
    if (gameActive && successfulMove) newPiece()
    successfulMove = false
}

function moveRight() {

    for (let r = 0; r < 4; r++) { // Look at each row
        for (let c = 2; c > -1; c--) { // Look at the first three columns, starting from the right

            if (gameArray[r][c] > 0) { // Find the rightmost piece that's potentially moveable
                let pieceToMove = document.querySelector(`.r${r}c${c}`)
                lookingForWhereToGo = true;

                for (let delta = 1; c + delta < 5 && lookingForWhereToGo; delta++) { // Start looking to its right...

                    // If you find the end of the board, move next to it if possible
                    if (c + delta > 3) {
                        if (delta > 1 && gameArray[r][3] === 0) move(pieceToMove, r, c, r, c + delta - 1)
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r][c + delta] === gameArray[r][c]) { 
                        combine(pieceToMove, r, c, r, c + delta)
                    
                    // If you find a piece of a different value, move next to it if possible
                    } else if (gameArray[r][c + delta] > 0) {
                        if (delta > 1 && gameArray[r][c + delta - 1] === 0) {
                            move(pieceToMove, r, c, r, c + delta - 1)
                        }
                    }
                }   
            }
        }
    }
    if (initialGame) checkScore()
    if (gameActive && successfulMove) newPiece()
    successfulMove = false
}

function moveUp() {

    for (let c = 0; c < 4; c++) { // Look at each column
        for (let r = 1; r < 4; r++) { // Look at the bottom three rows

            if (gameArray[r][c] > 0) { // Find the uppermost piece that's potentially moveable
                let pieceToMove = document.querySelector(`.r${r}c${c}`)
                lookingForWhereToGo = true;

                for (let delta = 1; r - delta > -2 && lookingForWhereToGo; delta++) {

                    // If you find the end of the board, move next to it if possible
                    if (r - delta < 0) {
                        if (delta > 1 && gameArray[0][c] === 0) {
                            move(pieceToMove, r, c, r - delta + 1, c)
                        }
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r - delta][c] === gameArray[r][c]) {
                        combine(pieceToMove, r, c, r - delta, c)
                    
                    // If you find a piece of a different value, move next to it if possible
                    } else if (gameArray[r - delta][c] > 0) {
                        if (delta > 1 && gameArray[r - delta + 1][c] === 0) {
                            move(pieceToMove, r, c, r - delta + 1, c)
                        }
                    }
                }
            }
        }
    }
    if (initialGame) checkScore()
    if (gameActive && successfulMove) newPiece()
    successfulMove = false
}

function moveDown() {
    for (let c = 0; c < 4; c++) { // Look at each column
        for (let r = 3; r > -1; r--) { // Look at the top three rows

            if (gameArray[r][c] > 0) { // Find the lowermost piece that's potentially moveable
                let pieceToMove = document.querySelector(`.r${r}c${c}`)
                lookingForWhereToGo = true;

                for (let delta = 1; r + delta < 5 && lookingForWhereToGo; delta++) {

                    // If you find the end of the board, move next to it if possible
                    if (r + delta > 3) {
                        if (delta > 1 && gameArray[3][c] === 0) move(pieceToMove, r, c, r + delta - 1, c)
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r + delta][c] === gameArray[r][c]) {
                        combine(pieceToMove, r, c, r + delta, c)
                    
                    // If you find a piece of a different value, move next to it if possible
                    } else if (gameArray[r + delta][c] > 0) {
                        if (delta > 1 && gameArray[r + delta - 1][c] === 0) {
                            move(pieceToMove, r, c, r + delta - 1, c)
                        }
                    }
                }
            }
        }
    }
    if (initialGame) checkScore()
    if (gameActive && successfulMove) newPiece()
    successfulMove = false
}

// NEW PIECE
// Find a random open index on gameArray
function randomOpenIndex() {
    let row;
    let column;
    let lookingForOpenRow = true;
    let lookingForOpenColumn = true;

    // Find a random row that contains a 0
    while (lookingForOpenRow) {
        row = Math.floor(Math.random() * 4); // Generate a random number between 0 and 3 (inclusive)
        if (gameArray[row].some(element => element === 0)) lookingForOpenRow = false
    }

    // Find a random element in that row equal to 0
    while (lookingForOpenColumn) {
        column = Math.floor(Math.random() * 4); // Generate a random number between 0 and 3 (inclusive)
        if (gameArray[row][column] === 0) lookingForOpenColumn = false
    }

    return [row, column];
}

// Generate a new piece at a random open square
function newPiece() {
    let $newPiece;
    let value;
    
    if (Math.random() < 0.2) value = 4
    else value = 2
    
    $newPiece = $(`<div class="piece v${value}" display=none>${value}</div>`).css('display', 'none')

    let position = randomOpenIndex()
    let row = position[0]
    let column = position[1]

    positionPiece($newPiece[0], row, column)
    $newPiece.addClass(`r${row}c${column}`)
    gameArray[row][column] = value

    $('.gameboard').prepend($newPiece)
    $newPiece.fadeIn(500, function() {
        // FadeIn complete
    })
}

newPiece(); newPiece() // Call newPiece() twice to generate the first two pieces

// TEST PIECES
// let $testPiece = $('<div class="piece v1024 r3c0">1024</div>')
//  $('.gameboard').prepend($testPiece)
// positionPiece($testPiece, 3,0)
// gameArray[3][0] = 1024

// let $testPiece2 = $('<div class="piece v1024 r3c1">1024</div>')
// $('.gameboard').prepend($testPiece2)
// positionPiece($testPiece2, 3,1)
// gameArray[3][1] = 1024

// let $testPiece3 = $('<div class="piece v2 r3c2">2</div>')
// $('.gameboard').prepend($testPiece3)
// positionPiece($testPiece3, 3,2)
// gameArray[3][2] = 2

// ENDGAME
$('.reset').on('click', reset)

function reset() {
    $('.piece').remove();
    gameArray = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ]
    gameActive = true
    newPiece(); newPiece();
}

function checkScore() {
    let noWinFound = true

    for (let r = 0; r < 4 && noWinFound; r++) {
        for (let c = 0; c < 4 && noWinFound; c++) {
            if (gameArray[r][c] === 2048) {
                youWin()
                noWinFound = false;
            }
        }
    }
    if (noWinFound) checkForLoss()
}

function checkForLoss() {
    let lossPossible = true;
    for (r = 0; r < 4 && lossPossible; r++) { // Look at each row
        for (c = 0; c < 4 && lossPossible; c++) { // Look at each column
            
            if (gameArray[r][c] === 0) lossPossible = false; // No loss if any square is empty
            
            else if (r > 0) { // No loss if there are matching pieces next to each other
                if (gameArray[r][c] === gameArray[r - 1][c]) lossPossible = false
            
            } else if (c > 0) { // No loss if there are matching pieces above/below each other
                if (gameArray[r][c] === gameArray[r][c - 1]) lossPossible = false
            }
        }
    }
    if (lossPossible) youLose()
}

function youWin() {
    gameActive = false
    $('.message').text('You win!')
    $('.message').after('<h4>Keep playing as long as you like!</h4>')
    wins++
    $('.winLossCount').text(`Wins: ${wins} | Losses: ${losses}`)
}

function youLose() {
    gameActive = false
    $('.message').text('You lose!')
    losses++
    $('.winLossCount').text(`Wins: ${wins} | Losses: ${losses}`)
}

function keepPlaying() {
    gameActive = true
    initialGame = false
    newPiece()
}