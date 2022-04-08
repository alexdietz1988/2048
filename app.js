// GENERAL-PURPOSE GAME OBJECTS
let lookingForWhereToGo;

// Array representing the values at each square
let gameArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
]

document.addEventListener('keydown', (e) => {
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
    lookingForWhereToGo = false
    pieceToMove.classList.replace(`r${oldRow}c${oldColumn}`, `r${newRow}c${newColumn}`)
    gameArray[newRow][newColumn] = gameArray[oldRow][oldColumn]
    gameArray[oldRow][oldColumn] = 0
    positionPiece(pieceToMove, newRow, newColumn)
}

function combine(pieceToMove, oldRow, oldColumn, newRow, newColumn) {
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
// let $testPiece = $('<div class="piece v8 r3c0">8</div>')
//  $('.gameboard').prepend($testPiece)
// positionPiece($testPiece, 3,0)
// gameArray[3][0] = 8

// let $testPiece2 = $('<div class="piece v4 r3c1">4</div>')
// $('.gameboard').prepend($testPiece2)
// positionPiece($testPiece2, 3,1)
// gameArray[3][1] = 4

// let $testPiece3 = $('<div class="piece v2 r3c2">2</div>')
// $('.gameboard').prepend($testPiece3)
// positionPiece($testPiece3, 3,2)
// gameArray[3][2] = 2

// FUNCTIONS TO MOVE IN EACH DIRECTION

function moveLeft() {

    for (let r = 0; r < 4; r++) { // Look at each row
        for (let c = 1; c < 4; c++) { // Look at the latter three columns

            if (gameArray[r][c] > 0) { // Find the leftmost piece that's potentially moveable
                let pieceToMove = document.querySelector(`.r${r}c${c}`)
                lookingForWhereToGo = true;
                console.log(`looking at the piece at ${r}, ${c}`)

                for (let delta = 1; c - delta > -2 && lookingForWhereToGo; delta++) { // Start looking to its left...

                    // If you find the end of the board, move next to it if possible
                    if (c - delta < 0) {
                        if (delta > 1 && gameArray[r][0] === 0) {
                            console.log('gonna try to move to the end of the board')
                            move(pieceToMove, r, c, r, c - delta + 1)
                        }
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r][c - delta] === gameArray[r][c]) {
                        console.log(`gonna try to combine with the piece at ${r}, ${c - delta}`)
                        combine(pieceToMove, r, c, r, c - delta)
                    
                    // If you find a piece of a different value, move next to it if possible
                    } else if (gameArray[r][c - delta] > 0) {
                        if (delta > 1 && gameArray[r][c - delta + 1] === 0) {
                            console.log(`gonna try to move next to the piece at ${r}, ${c - delta}`)
                            move(pieceToMove, r, c, r, c - delta + 1)
                        }
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
    newPiece()
}

function moveUp() {

    for (let c = 0; c < 4; c++) { // Look at each column
        for (let r = 1; r < 4; r++) { // Look at the bottom three rows

            if (gameArray[r][c] > 0) { // Find the uppermost piece that's potentially moveable
                let pieceToMove = document.querySelector(`.r${r}c${c}`)
                lookingForWhereToGo = true;
                console.log(`looking at the piece at ${r}, ${c}`)

                for (let delta = 1; r - delta > -2 && lookingForWhereToGo; delta++) {

                    // If you find the end of the board, move next to it if possible
                    if (r - delta < 0) {
                        if (delta > 1 && gameArray[0][c] === 0) {
                            console.log('gonna try to move to the end of the board')
                            move(pieceToMove, r, c, r - delta + 1, c)
                        }
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r - delta][c] === gameArray[r][c]) {
                        console.log(`gonna try to combine with the piece at ${r - delta}, ${c}`)
                        combine(pieceToMove, r, c, r - delta, c)
                    
                    // If you find a piece of a different value, move next to it if possible
                    } else if (gameArray[r - delta][c] > 0) {
                        if (delta > 1 && gameArray[r - delta + 1][c] === 0) {
                            console.log(`gonna try to move next to the piece at ${r - delta}, ${c}`)
                            move(pieceToMove, r, c, r - delta + 1, c)
                        }
                    }
                }
            }
        }
    }
    newPiece()
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
    let $newPiece = $('<div class="piece v2" display=none>2</div>').css('display', 'none')
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
    newPiece(); newPiece();
}

// LATER
    // 6. (Stretch) I may write code to keep track of the current score, high score, and win/loss count.

    // ### Endgame
    // 1. I'll create functions to check the gameboard array after each move for a win or loss. If it finds one, it will end the game and display an appropriate message.
    // 2. I'll create a reset button to reset the gameboard.