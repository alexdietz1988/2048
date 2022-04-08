// GENERAL-PURPOSE GAME OBJECTS
let lookingForWhereToGo;

// Array representing the values at each square
let gameArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
]

// Move buttons
$('.left').on('click', moveLeft)
$('.right').on('click', moveRight)
$('.up').on('click', moveUp)
$('.down').on('click', moveDown)

// GENERAL-PURPOSE FUNCTIONS
function positionPiece(piece, row, column) {
    $(piece).css( {'top': `${row * 100}px`, 'left': `${column * 100}px`})
}

function move (pieceToMove, oldRow, oldColumn, newRow, newColumn) {
    lookingForWhereToGo = false
    pieceToMove.classList.replace(`r${oldRow}c${oldColumn}`, `r${newRow}c${newColumn}`)
    gameArray[newRow][newColumn] = gameArray[oldRow][oldColumn]
    gameArray[oldRow][oldColumn] = 0
    positionPiece(pieceToMove, newRow, newColumn)
}

function combine (pieceToMove, oldRow, oldColumn, newRow, newColumn) {
    lookingForWhereToGo = false

    // Remove the existing piece
    let existingPiece = document.querySelector(`.r${newRow}c${newColumn}`)
    existingPiece.remove()

    // Move the new piece
    pieceToMove.classList.replace(`r${oldRow}c${oldColumn}`, `r${newRow}c${newColumn}`)
    positionPiece(pieceToMove, newRow, newColumn)
    gameArray[oldRow][oldColumn] = 0 // Update the gameArray to reflect that the piece has moved

    // Double value of remaining piece
    let newValue = gameArray[newRow][newColumn] * 2
    pieceToMove.classList.replace(`v${newValue / 2}`, `v${newValue}`)
    $(pieceToMove).text(newValue)
    gameArray[newRow][newColumn] = newValue
}

// TEST PIECES
// let $testPiece = $('<div class="square piece" data-value="2" data-position="">2</div>')
 // $('.gameboard').prepend($testPiece)
// positionPiece($testPiece, 1,1)
// gameArray[1][1] = 2

// let $testPiece2 = $('<div class="square piece" data-value="2" data-position=""">2</div>')
// $('.gameboard').prepend($testPiece2)
// positionPiece($testPiece2, 1,3)
// gameArray[1][3] = 2

// let $testPiece3 = $('<div class="square piece" data-value="2" data-position="">2</div>')
// $('.gameboard').prepend($testPiece3)
// positionPiece($testPiece3, 1,1)
// gameArray[1][1] = 2

// let pieces = document.querySelectorAll(`[data-position="1,1"]`)
// console.log(pieces)

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
                        if (delta > 1) move(pieceToMove, r, c, r, c - delta + 1)
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r][c - delta] === gameArray[r][c]) { 
                        combine(pieceToMove, r, c, r, c - delta)
                    
                    // If you find a piece of a different value, move next to it if possible
                    } else if (gameArray[r][c - delta] > 0) {
                        if (delta > 1) move(pieceToMove, r, c, r, c - delta + 1)
                    }
                }
            }
        }
    }
    newPiece()
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
                        if (delta > 1) move(pieceToMove, r, c, r, c + delta - 1)
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r][c + delta] === gameArray[r][c]) { 
                        combine(pieceToMove, r, c, r, c + delta)
                    
                    // If you find a piece of a different value, move next to it if possible
                    } else if (gameArray[r][c + delta] > 0) {
                        if (delta > 1) move(pieceToMove, r, c, r, c + delta - 1)
                    }
                }   
            }
        }
    }
    newPiece()
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
                        if (delta > 1) move(pieceToMove, r, c, r - delta + 1, c)
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r - delta][c] === gameArray[r][c]) {
                        combine(pieceToMove, r, c, r - delta, c)
                    
                    // If you find a piece of a different value, or the end of the board, move next to it if possible
                    } else if (gameArray[r - delta][c] > 0) {
                        if (delta > 1) move(pieceToMove, r, c, r - delta + 1, c)
                    }
                }
            }
        }
    }
    newPiece()
}

function moveDown() {

    for (let c = 0; c < 4; c++) { // Look at each column
        for (let r = 0; r < 3; r++) { // Look at the top three rows

            if (gameArray[r][c] > 0) { // Find the lowermost piece that's potentially moveable
                let pieceToMove = document.querySelector(`.r${r}c${c}`)
                lookingForWhereToGo = true;

                for (let delta = 1; r + delta < 5 && lookingForWhereToGo; delta++) {

                    // If you find the end of the board, move next to it if possible
                    if (r + delta > 3) {
                        if (delta > 1) move(pieceToMove, r, c, r + delta - 1, c)
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r + delta][c] === gameArray[r][c]) {
                        combine(r, c, r + delta, c)
                    
                    // If you find a piece of a different value, or the end of the board, move next to it if possible
                    } else if ((gameArray[r + delta][c] > 0) && delta > 1) {
                        move(pieceToMove, r, c, r + delta - 1, c)
                    }
                }
            }
        }
    }
    newPiece()
}

// INITIALIZE THE GAMEBOARD
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
    let $newPiece = $('<div class="square piece v2" display=none>2</div>').css('display', 'none')
    let position = randomOpenIndex()
    let row = position[0]
    let column = position[1]
    positionPiece($newPiece[0], row, column)
    $newPiece.addClass(`r${row}c${column}`)
    gameArray[row][column] = 2

    $('.gameboard').prepend($newPiece)
    $newPiece.fadeIn(1000, function() {
        // FadeIn complete
    })
}

newPiece(); newPiece() // Call newPiece() twice to generate the first two pieces

// LATER
    // 5. (Stretch) I may try writing event listeners to allow the user to move the pieces by using their arrow keys.
    // 6. (Stretch) I may write code to keep track of the current score, high score, and win/loss count.

    // ### Endgame
    // 1. I'll create functions to check the gameboard array after each move for a win or loss. If it finds one, it will end the game and display an appropriate message.
    // 2. I'll create a reset button to reset the gameboard.