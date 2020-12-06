// SOCKET SETUP
// Make connection

// const { emit } = require("nodemon")

// Frontend socket var
var socket = io.connect('http://localhost:4000')

// Sends data to the server
function emitBoard(boardString){
    socket.emit('emitBoard', boardString)
}

// Listen for socket events
socket.on('emitBoard', function(data){
    // console.log(data)
    genBoardFromString(data)
})


// UTILITY
// Set pointer to follow mouse
let pointer = document.getElementById('pointer');
const onMouseMove = (e) =>{
  pointer.style.left = e.pageX + 'px';
  pointer.style.top = e.pageY + 'px';
}
document.addEventListener('mousemove', onMouseMove);

// Game
// Create a board
function genBoard(){

    var rows = ["row8","row7","row6","row5","row4","row3","row2","row1"]
    var columns = ["colA","colB","colC","colD","colE","colF","colG","colH"]
    var rowId, cell = null
    for( i=0; i < 8; i++){
        rowId = rows[i]

        for( b=0; b < columns.length; b++){
            cell = document.createElement("div")

            cell.setAttribute("style", `grid-area: ${rowId}/${columns[b]};`)
            cell.id=`${rowId}${columns[b]}`
            cell.classList="blank"
            cell.setAttribute("onclick", "select(this)")
            // cell.innerHTML = `${columns[b].split('')[3]}${rowId.split('')[3]}`

            document.querySelector(".board").appendChild(cell)
        }
    }  
}

genBoard()

// Manipulate the board
var targetElem = null
var previousCell = null
var storedFigure = null

//STOR FIGURE
function storeClass(elem){
    storedFigure = document.getElementById(elem.id).classList[0]

    //Remove selection
    if(previousCell !== null){
        previousCell.classList.remove('selected') 
    }
    previousCell = null

    //Set pointer indicator
    document.getElementById('pointer').classList = storedFigure
}

//NOTIFICATIONS
function notify(obj, method){
    var status = document.getElementById('status')

    if(typeof obj !== 'string'){return}

    if(method === 'save'){
        status.innerHTML = `Saved ${obj.toUpperCase()}, click on the cell to place the figure.`
    }
    else if(method === 'paste'){
        status.innerHTML = `${obj.toUpperCase()} placed.`
    }
}

// MAIN
function select(elem) {
    var selectedCell = document.getElementById(elem.id)

    //Clear pointer
    document.getElementById('pointer').classList = ''
    //Clear status
    document.getElementById('status').innerHTML = ''

    // Place figure
    if(storedFigure !== null){
        document.getElementById(elem.id).classList = storedFigure

        // notify(storedFigure, 'paste')
        storedFigure = null

        if(previousCell !== selectedCell){
            previousCell.classList = 'blank'
        }

        //Set pointer indicator
        document.getElementById('pointer').classList = 'blank'

        // Store board state as a string
        convertBoardToString()
    }

    // Store figure
    else if(selectedCell.classList[0] !== 'blank'){
        storedFigure = document.getElementById(elem.id).classList[0]
        selectedCell.classList = 'blank'

        //Set pointer indicator
        document.getElementById('pointer').classList = storedFigure

        // notify(storedFigure, 'save')
    }

    // Clear selection from previous cell
    if(previousCell !== null){
        previousCell.classList.remove('selected') 
    }

    // Overwrite source element
    previousCell = document.getElementById(elem.id)
    
    // New selection
    document.getElementById(elem.id).classList.add("selected"); 

}

// Convert board state to string
var boardStateString
let testSet = 'blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank rook blank rook blank rook blank blank blank blank rook blank rook blank blank blank blank rook blank rook blank rook blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank '

function convertBoardToString(){

    // Clear board string
    boardStateString = ''

    // Board nodes object
    var boardObj = document.querySelector('.board').childNodes

    for( i = 0; i < boardObj.length ; i++ ){
        boardStateString += boardObj[i].classList[0] + ' '
    }

    // Send it via websocket
    // console.log(boardStateString)
    emitBoard(boardStateString)
}

// Generate board from string
function genBoardFromString(string){

    //Board nodes object
    var boardObj = document.querySelector('.board').childNodes
    var boardFigureClasses = string.split(' ')

    for( i = 0; i < boardObj.length ; i++ ){
        boardObj[i].classList = boardFigureClasses[i]
    }

}