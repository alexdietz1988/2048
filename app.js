// ### Initializing the gameboard

// Array representing the values at each square
let gameArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
]

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

// Use an index on the gameboard array to position an element
function positionPiece(piece, row, column) {
    $(piece).css( {'top': `${row * 100}px`, 'left': `${column * 100}px`})
    piece.dataset.position = `${row},${column}`
    gameArray[row][column] = piece.dataset.value
    // console.log(piece)
    // console.log(piece.dataset)
    // console.log(piece.dataset.position)
    // console.log(piece.dataset.value)
    // console.table(gameArray)
}

// Generate a new piece at a random open square
function newPiece() {
    let $newPiece = $('<div class="square piece" data-value="2" data-position=" ">2</div>')
    $('.gameboard').prepend($newPiece)

    let newRow = [...randomOpenIndex()][0]
    let newColumn = [...randomOpenIndex()][1]
    positionPiece($newPiece[0], newRow, newColumn)
    // console.log($newPiece[0].dataset)
    // console.table(gameArray)
}

// Call newPiece() twice to generate the first two pieces
newPiece()
newPiece()

// TEST PIECES
    // let $testPiece = $('<div class="square piece" data-value="2" data-position="">2</div>')
    // $('.gameboard').prepend($testPiece)
    // positionPiece($testPiece, 1,1)
    // $testPiece[0].dataset.position = '1,1'
    // gameArray[1][1] = 2

    // let $testPiece2 = $('<div class="square piece" data-value="2" data-position=""">2</div>')
    // $('.gameboard').prepend($testPiece2)
    // positionPiece($testPiece2, 1,3)
    // $testPiece2[0].dataset.position = '1,3'
    // gameArray[1][3] = 2

    // let $testPiece3 = $('<div class="square piece" data-value="2" data-position="">2</div>')
    // $('.gameboard').prepend($testPiece3)
    // positionPiece($testPiece3, 1,1)
    // $testPiece3[0].dataset.position = '1,1'
    // gameArray[1][1] = 2

    // let pieces = document.querySelectorAll(`[data-position="1,1"]`)
    // console.log(pieces)

// ### Moving pieces
// 1. I'll create a function to move pieces left. This will take the leftmost element in each row and start looking to its left until it finds (a) the end of the row, (b) an element of a different value, or (c) an element of the same value. It will give the index that the element should be "moved" to, and will call the function in (4) above using that index to move the actual piece, and will also update the gameboard array appropriately. The function will then do the same thing with the next-to-leftmost element in each row, and so on. Finally, it will call the functions to randomly generate a new piece.

// Find piece at position
function pieceAtPosition(row, column) {
    return $(`[data-position='${row},${column}']`)[0]
}

function combinePiecesAt(row, column) {
    console.log('Gonna try to combine')
    let pieces = document.querySelectorAll(`[data-position="${row},${column}"]`)
    console.log(pieces[1])
    pieces[1].remove() // Remove one of the pieces

    let newValue = pieces[0].dataset.value *= 2
    pieces[0].dataset.value = newValue // Double value of remaining piece
    $(pieces[0]).text(newValue)
    gameArray[row][column] = newValue
}

function moveLeft() {

    for (let r = 0; r < 4; r++) { // Look at each row
        for (let c = 1; c < 4; c++) { // Look at the latter three columns

            if (gameArray[r][c] > 0) { // Find the leftmost piece
                let pieceToMove = pieceAtPosition(r, c)
                console.log(pieceToMove)
                let lookingForWhereToGo = true;
                let delta = 1;

                while (lookingForWhereToGo) {
                    if (gameArray[r][c - delta] === 0) delta++ // If the square to its left is empty, keep looking left
                    else if (c - delta < 0 || gameArray[r][c - delta] !== 0) { // Once you find the end of the board or a non-empty square...
                        
                        if (gameArray[r][c - delta] === gameArray[r][c]) { // Move to that position if same value
                            positionPiece(pieceToMove, r, c - delta) 
                            combinePiecesAt(r, c - delta)
                            gameArray[r][c] = 0 // Update the gameArray to reflect that the piece has moved
                            
                        } else {
                            positionPiece(pieceToMove, r, c - delta + 1) // Locate at next position if end of board or different value
                            gameArray[r][c - delta + 1] = pieceToMove.dataset.value
                            if (c - delta + 1 !== c) gameArray[r][c] = 0 // Update the gameArray if the piece has changed position
                        }
                    lookingForWhereToGo = false
        }}}}}

    newPiece()
}

function moveRight() {

    for (let r = 0; r < 4; r++) { // Look at each row
        for (let c = 2; c > -1; c--) { // Look at the first three columns, starting from the right

            if (gameArray[r][c] > 0) { // Find the rightmost piece
                let pieceToMove = pieceAtPosition(r, c)
                let lookingForWhereToGo = true;
                let delta = 1;

                while (lookingForWhereToGo) {
                    if (gameArray[r][c + delta] === 0) delta++ // If the square to its right is empty, keep looking right
                    else if (c + delta > 3 || gameArray[r][c + delta] !== 0) { // Once you find the end of the board or a non-empty square...
                        
                        if (gameArray[r][c + delta] === gameArray[r][c]) {
                            positionPiece(pieceToMove, r, c + delta) // Move to that position if same value
                            combinePiecesAt(r, c + delta)
                            gameArray[r][c] = 0 // Update the gameArray to reflect that the piece has moved
                            
                        } else {
                            positionPiece(pieceToMove, r, c + delta - 1) // Locate at next position if end of board or different value
                            gameArray[r][c + delta - 1] = pieceToMove.dataset.value
                            if (c + delta - 1 !== c) gameArray[r][c] = 0 // Update the gameArray if the piece has changed position
                        }
                    lookingForWhereToGo = false
        }}}}}
        
    newPiece()
}

function moveUp() {

    for (let c = 0; c < 4; c++) { // Look at each column
        console.log(`Looking at column ${c}`)
        for (let r = 1; r < 4; r++) { // Look at the bottom three rows

            if (gameArray[r][c] > 0) { // Find the uppermost piece
                let pieceToMove = pieceAtPosition(r, c)
                console.log(`Looking at the piece at ${r}, ${c}`)
                let lookingForWhereToGo = true;
                let delta = 1;

                while (lookingForWhereToGo) {

                    if (r - delta < 0) {
                        console.log('I have reached the end of the board')
                        positionPiece(pieceToMove, r - delta + 1, c) // If you've reached the end of the board, locate at next square
                        gameArray[r - delta + 1][c] = pieceToMove.dataset.value
                        lookingForWhereToGo = false

                    } else if (gameArray[r - delta][c] === 0) { // If you've reached an empty square, keep looking up
                        console.log('I will keep looking up')
                        delta++ 

                    } else if (gameArray[r - delta][c] > 0) { // If you've reached a non-empty square...
                        console.log('I have reached a non-empty square')
                        
                        if (gameArray[r - delta][c] === gameArray[r][c]) { // Move to that position if same value
                            positionPiece(pieceToMove, r - delta, c) 
                            console.log('I am going to combine pieces')
                            combinePiecesAt(r - delta, c)
                            gameArray[r][c] = 0 // Update the gameArray to reflect that the piece has moved
                            
                        } else {
                            positionPiece(pieceToMove, r - delta + 1, c) // Locate at next position if end of board or different value
                            gameArray[r - delta + 1][c] = pieceToMove.dataset.value
                            if (r - delta + 1 !== r) {
                                console.log ('I am going to move the piece')
                                gameArray[r][c] = 0
                            } // Update the gameArray if the piece has changed position
                        }

                        lookingForWhereToGo = false
        }}}}}

    newPiece()
}

// 2. In my HTML and CSS, I'll create a button to move pieces left. In my JavaScript, I'll grab it and give it an event listener so that clicking it will call the "move left" function.
$('.left').on('click', moveLeft)
$('.right').on('click', moveRight)
$('.up').on('click', moveUp)

// 3. For the case where a piece moves to the square held by a piece of the same value, I'll create a function to remove both pieces and replace them with a piece of the appropriate value.
// 4. I'll create similar functions and buttons for moving right, up, or down.
// 5. (Stretch) I may try writing event listeners to allow the user to move the pieces by using their arrow keys.
// 6. (Stretch) I may write code to keep track of the current score, high score, and win/loss count.

// ### Endgame
// 1. I'll create functions to check the gameboard array after each move for a win or loss. If it finds one, it will end the game and display an appropriate message.
// 2. I'll create a reset button to reset the gameboard.