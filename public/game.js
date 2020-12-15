// SOCKET SETUP
// Make connection > Frontend socket var > Swap before uploading to heroku
var socket = io.connect('https://arch-chess.herokuapp.com/' || 'http://localhost:4000')
// var socket = io.connect('http://localhost:4000')

// Sends data to the server
function emitBoard(boardString){
    socket.emit('emitBoard', boardString)
}

// Listen for socket events
socket.on('emitBoard', function(data){
    // console.log(data)
    genBoardFromString(data)
})

// Player mangement
players = []

socket.on('playerJoined', function(data){    
    players = data
    // console.log(data)
    updatePlayerList()
})

socket.on('playerLeft', function(data){
    players = data

    updatePlayerList()
})

function updatePlayerList(){
    document.getElementById('players').innerHTML = ''

    for(i=0; i < players.length; i++){
        document.getElementById('players').innerHTML += players[i] + ', '
    }
}


// UTILITY
// Set pointer to follow mouse
let pointer = document.getElementById('pointer');
const onMouseMove = (e) =>{
  pointer.style.left = e.pageX + 'px';
  pointer.style.top = e.pageY + 'px';
}
document.addEventListener('mousemove', onMouseMove);

// Notifications
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

// Convert board state to string
var boardStateString

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

var compCostWhite
var compCostBlack
var figureCost = [
    {
        name: 'pawn',
        nameWhite: 'pawnW',
        cost: 2
    },
    {
        name: 'knight',
        nameWhite: 'knightW',
        cost: 4
    },
    {
        name: 'bishop',
        nameWhite: 'bishopW',
        cost: 5
    },
    {
        name: 'rook',
        nameWhite: 'rookW',
        cost: 7
    },
    {
        name: 'queen',
        nameWhite: 'queenW',
        cost: 10
    },
    {
        name: 'king',
        nameWhite: 'kingW',
        cost: 0
    },
    {
        name: 'necr',
        nameWhite: 'necrW',
        cost: 3
    },
    {
        name: 'rogue',
        nameWhite: 'rogueW',
        cost: 7
    },
    {
        name: 'archer',
        nameWhite: 'archerW',
        cost: 4
    },
    {
        name: 'bomb',
        nameWhite: 'bombW',
        cost: 2
    },
    {
        name: 'ballista',
        nameWhite: 'ballistaW',
        cost: 2
    },
    {
        name: 'portal',
        nameWhite: 'portalW',
        cost: 3
    },
    {
        name: 'wall',
        nameWhite: 'wallW',
        cost: 1
    },
    {
        name: 'prince',
        nameWhite: 'princeW',
        cost: 5
    },
]

// Generate board from string
var selectedCell = null
function genBoardFromString(string){

    //Board nodes object
    var boardObj = document.querySelector('.board').childNodes
    var boardFigureClasses = string.split(' ')

    //Reset board cost
    compCostWhite = 0
    compCostBlack = 0

    for( i = 0; i < boardObj.length ; i++ ){
        //Add figure
        boardObj[i].classList = boardFigureClasses[i]

        //Calculate figure cost
        if(boardFigureClasses[i] !== 'blank' && boardFigureClasses[i].includes('W')){
            // console.log(figureCost.filter(x => x.nameWhite === boardFigureClasses[i])[0].cost)
            compCostWhite += figureCost.filter(x => x.nameWhite === boardFigureClasses[i])[0].cost
            document.getElementById('compCostWhite').innerHTML = `Comp cost: ${compCostWhite}`
        }
        else if (boardFigureClasses[i] !== 'blank') {
            compCostBlack += figureCost.filter(x => x.name === boardFigureClasses[i])[0].cost
            document.getElementById('compCostBlack').innerHTML = `Comp cost: ${compCostBlack}`
        }
    }

    // Reset selection
    if(selectedCell !== null){
        selectedCell.classList.add("selected");
    }
}

function clearCell(){
    document.querySelector('.selected').classList = 'blank'
    
    // Reset pointer indicator
    document.getElementById('pointer').classList = 'blank'

    // Reset stored figure
    storedFigure = null
}

// GAME
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
    
    //Add cost to figures
    for(i=0; i < figureCost.length; i++){
        document.getElementById(figureCost[i].nameWhite).innerHTML = figureCost[i].cost
        document.getElementById(figureCost[i].name).innerHTML = figureCost[i].cost
    }
}
genBoard()

// Manipulate the board
var targetElem = null
var previousCell = null
var storedFigure = null

// Store figure
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

// Move
function select(elem) {
    selectedCell = document.getElementById(elem.id)

    //Clear pointer
    document.getElementById('pointer').classList = ''
    //Clear status
    document.getElementById('status').innerHTML = ''

    // Place figure
    if(storedFigure !== null){
        document.getElementById(elem.id).classList = storedFigure

        // notify(storedFigure, 'paste')
        storedFigure = null

        if(previousCell !== selectedCell && previousCell !== null){
            previousCell.classList = 'blank'
        }

        //Reset pointer indicator
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

        // Store board state as a string
        convertBoardToString()
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

function hide(elem){
    document.getElementById(elem).classList.toggle("hide")
    // console.log(document.getElementById(elem.id))
}