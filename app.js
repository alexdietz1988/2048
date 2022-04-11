// GLOBAL VARIABLES
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
    endMove()
})

// GENERAL-PURPOSE FUNCTIONS
function move(pieceToMove, oldRow, oldColumn, newRow, newColumn) {
    lookingForWhereToGo = false;
    successfulMove = true;
    pieceToMove.classList.replace(`r${oldRow}c${oldColumn}`, `r${newRow}c${newColumn}`);
    gameArray[newRow][newColumn] = gameArray[oldRow][oldColumn];
    gameArray[oldRow][oldColumn] = 0;
    $(pieceToMove).css( {'top': `${newRow * 100}px`, 'left': `${newColumn * 100}px`})
}

function combine(pieceToMove, oldRow, oldColumn, newRow, newColumn) {    
    $(`.r${newRow}c${newColumn}`).remove() // Remove the existing piece
    
    // Move the new piece, then double its value
    move(pieceToMove, oldRow, oldColumn, newRow, newColumn)
    let newValue = gameArray[newRow][newColumn] * 2
    pieceToMove.classList.replace(`v${newValue / 2}`, `v${newValue}`)
    $(pieceToMove).removeClass('combinable')
    $(pieceToMove).text(newValue)
    gameArray[newRow][newColumn] = newValue

    currentScore += newValue
    if (currentScore > highScore) highScore = currentScore
    $('.currentScore').text(`${currentScore}`)
    $('.highScore').text(`${highScore}`)
}

function endMove() {
    if (initialGame) checkForWin()
    $('.piece').addClass('combinable')
    if (gameActive && successfulMove){
        newPiece()
        checkForLoss()
    }
    successfulMove = false
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
                    } else if (gameArray[r][c - delta] === gameArray[r][c] && $(`.r${r}c${c - delta}`).hasClass('combinable')) {
                        combine(pieceToMove, r, c, r, c - delta)
                    
                    // If you find a piece of a different value, move next to it if possible, otherwise stop looking
                    } else if (gameArray[r][c - delta] > 0) {
                        if (delta > 1 && gameArray[r][c - delta + 1] === 0) {
                            move(pieceToMove, r, c, r, c - delta + 1)
                        } else lookingForWhereToGo = false
                    }
                }
            }
        }
    }
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
                    } else if (gameArray[r][c + delta] === gameArray[r][c] && $(`.r${r}c${c - delta}`).hasClass('combinable')) { 
                        combine(pieceToMove, r, c, r, c + delta)
                    
                    // If you find a piece of a different value, move next to it if possible, otherwise stop looking
                    } else if (gameArray[r][c + delta] > 0) {
                        if (delta > 1 && gameArray[r][c + delta - 1] === 0) {
                            move(pieceToMove, r, c, r, c + delta - 1)
                        } else lookingForWhereToGo = false
                    }
                }   
            }
        }
    }
}

function moveUp() {
    for (let c = 0; c < 4; c++) { // Look at each column
        for (let r = 1; r < 4; r++) { // Look at the bottom three rows

            if (gameArray[r][c] > 0) { // Find the uppermost piece that's potentially moveable
                let pieceToMove = document.querySelector(`.r${r}c${c}`)
                lookingForWhereToGo = true;

                for (let delta = 1; r - delta > -2 && lookingForWhereToGo; delta++) { // Start looking above it...

                    // If you find the end of the board, move next to it if possible
                    if (r - delta < 0) {
                        if (delta > 1 && gameArray[0][c] === 0) {
                            move(pieceToMove, r, c, r - delta + 1, c)
                        }
                    
                    // If you find a piece of the same value, combine them
                    } else if (gameArray[r - delta][c] === gameArray[r][c] && $(`.r${r - delta}c${c}`).hasClass('combinable')) {
                        combine(pieceToMove, r, c, r - delta, c)
                    
                    // If you find a piece of a different value, move next to it if possible, otherwise stop looking
                    } else if (gameArray[r - delta][c] > 0) {
                        if (delta > 1 && gameArray[r - delta + 1][c] === 0) {
                            move(pieceToMove, r, c, r - delta + 1, c)
                        } else lookingForWhereToGo = false
                    }
                }
            }
        }
    }
}

function moveDown() {
    for (let c = 0; c < 4; c++) { // Look at each column
        for (let r = 3; r > -1; r--) { // Look at the top three rows

            if (gameArray[r][c] > 0) { // Find the lowermost piece that's potentially moveable
                let pieceToMove = document.querySelector(`.r${r}c${c}`)
                lookingForWhereToGo = true;

                for (let delta = 1; r + delta < 5 && lookingForWhereToGo; delta++) { // Start looking below it...

                    // If you find the end of the board, move next to it if possible
                    if (r + delta > 3) {
                        if (delta > 1 && gameArray[3][c] === 0) {
                            move(pieceToMove, r, c, r + delta - 1, c)
                        }
                    
                    // If you find a piece of the same value, combine them if possible
                    } else if (gameArray[r + delta][c] === gameArray[r][c]
                        && $(`.r${r + delta}c${c}`).hasClass('combinable')) {
                            combine(pieceToMove, r, c, r + delta, c)
                    
                    // If you find a piece of a different value, move next to it if possible, otherwise stop looking 
                    } else if (gameArray[r + delta][c] > 0) {
                        if (delta > 1 && gameArray[r + delta - 1][c] === 0) {
                            move(pieceToMove, r, c, r + delta - 1, c)
                        } else lookingForWhereToGo = false
                    }
                }
            }
        }
    }
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
    let value;
    if (Math.random() < 0.2) value = 4
    else value = 2
    let position = randomOpenIndex()
    let row = position[0]
    let column = position[1]

    let $newPiece = $(`<div class="piece v${value} r${row}c${column} combinable">${value}</div>`)
        .css({'top': `${row * 100}px`, 'left': `${column * 100}px`, 'display': 'none'})
    gameArray[row][column] = value

    $('.gameboard').prepend($newPiece)
    $newPiece.fadeIn(500, function() {
        // FadeIn complete
    })
}

// newPiece(); newPiece() // Call newPiece() twice to generate the first two pieces

// TEST PIECES
// let $testPiece0 = $('<div class="piece v4 r1c0 combinable">4</div>')
// $('.gameboard').prepend($testPiece3)
// $testPiece3.css( {'top': `${1 * 100}px`, 'left': `${0 * 100}px`, 'display': 'none'})
// gameArray[1][0] = 4

// let $testPiece4 = $('<div class="piece v2 r2c0 combinable">2</div>')
// $('.gameboard').prepend($testPiece4)
// $testPiece4.css( {'top': `${2 * 100}px`, 'left': `${0 * 100}px`, 'display': 'none'})
// gameArray[2][0] = 2

// let $testPiece5 = $('<div class="piece v2 r3c0 combinable">2</div>')
// $('.gameboard').prepend($testPiece5)
// $testPiece5.css( {'top': `${3 * 100}px`, 'left': `${0 * 100}px`, 'display': 'none'})
// gameArray[3][0] = 2

function simulate(arr) {
    let $testPiece;

    for (let r = 0; r < arr.length; r++) {
        for (let c = 0; c < arr[r].length; c++) {
            if (arr[r][c] > 0) {
                $testPiece = $(`<div class="piece v${arr[r][c]} r${r}c${c} combinable">${arr[r][c]}</div>`)
                    .css( {'top': `${r * 100}px`, 'left': `${c * 100}px`})
                $('.gameboard').prepend($testPiece)
            }
        }
    }
    gameArray = arr
}

let simulateLoss = [
    [2,16,128,8],
    [8,32,0,16],
    [16,2,256,1024],
    [4,128,4,2],
]

// simulate(simulateLoss)

let testArray = [
    [0,0,0,0],
    [4,0,0,0],
    [2,0,0,0],
    [4,0,0,0]
]

// simulate(testArray)

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
    $('.message').html('Use the arrow keys to move the tiles,<br />combine them to get to 2048!')
    $('.currentScore').text('0')
}

function checkForWin() {
    let noWinFound = true

    for (let r = 0; r < 4 && noWinFound; r++) {
        for (let c = 0; c < 4 && noWinFound; c++) {
            if (gameArray[r][c] === 2048) {
                youWin()
                noWinFound = false;
            }
        }
    }
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
    $('.piece').css('opacity', '0.3')
}

function keepPlaying() {
    gameActive = true
    initialGame = false
    newPiece()
}