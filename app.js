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
    let top = row * 100;
    let left = column * 100
    $(piece).css( {'top': `${top}px`, 'left': `${left}px`})
}

// Generate a new piece at a random open square
function newPiece() {
    let $newPiece = $('<div class="square piece">2</div>')
    let position = [...randomOpenIndex()]
    $('.gameboard').prepend($newPiece)
    positionPiece($newPiece, ...position)
    gameArray[position[0]][position[1]] = 2
}

// Call newPiece() twice to generate the first two pieces
newPiece(); newPiece()

// ### Moving pieces
// 1. I'll create a function to move pieces left. This will take the leftmost element in each row and start looking to its left until it finds (a) the end of the row, (b) an element of a different value, or (c) an element of the same value. It will give the index that the element should be "moved" to, and will call the function in (4) above using that index to move the actual piece, and will also update the gameboard array appropriately. The function will then do the same thing with the next-to-leftmost element in each row, and so on. Finally, it will call the functions to randomly generate a new piece.

function moveLeft() {

    for (let i = 0; i < 4; i++) { // Look at each row
        for (let j = 1; j < 4; j++) { // Look at the latter three columns
            if (gameArray[i][j] > 0) { // Find the leftmost piece

                let lookingForWhereToGo = true;
                let k = 1;

                while (lookingForWhereToGo) {
                    if (gameArray[i][j - k] === 0) k++ // If the square is empty, look to its left
                    else if (gameArray[i][j - k] === 0 === false) { // Once you find a non-empty square or the end of the board...

                        if (gameArray[i][j - k] === gameArray[i][j]) {
                            console.log(`New position: [${i}][${j - k}]`) // Move to that position if same value
                            lookingForWhereToGo = false
                        } else {
                            console.log(`New position: [${i}][${j - k + 1}]`) // Move to next position if different value
                            lookingForWhereToGo = false
                        } 
                    }
                }

            }
        }
    }

}

moveLeft()

// Find piece at position

// 2. In my HTML and CSS, I'll create a button to move pieces left. In my JavaScript, I'll grab it and give it an event listener so that clicking it will call the "move left" function.
// 3. For the case where a piece moves to the square held by a piece of the same value, I'll create a function to remove both pieces and replace them with a piece of the appropriate value.
// 4. I'll create similar functions and buttons for moving right, up, or down.
// 5. (Stretch) I may try writing event listeners to allow the user to move the pieces by using their arrow keys.
// 6. (Stretch) I may write code to keep track of the current score, high score, and win/loss count.

// ### Endgame
// 1. I'll create functions to check the gameboard array after each move for a win or loss. If it finds one, it will end the game and display an appropriate message.
// 2. I'll create a reset button to reset the gameboard.