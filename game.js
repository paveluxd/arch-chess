// Create a fucking board
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
            cell.innerHTML = `${columns[b].split('')[3]}${rowId.split('')[3]}`;

            document.querySelector(".board").appendChild(cell)
        }
    }  
}

genBoard()

var targetElem = null
var sourceElem = null

function moveClass(elem){
    sourceElem = document.getElementById(elem.id)
    targetElem.classList = elem.classList[0]
    targetElem = null;
}

function select(elem) {
    
    // Clear selection from previous cell
    if(sourceElem !== null){
        sourceElem.classList.remove('selected')
    }
    
    // New selection
    document.getElementById(elem.id).classList.add("selected"); 

    
    //Add figures
    if(sourceElem !== null && sourceElem.classList[0] !== 'blank'){
        document.getElementById(elem.id).classList.add(sourceElem.classList[0])
        document.getElementById(elem.id).classList.remove('blank')
        console.log(sourceElem)
    }
    
    // Overwrite source element
    sourceElem = document.getElementById(elem.id)
    
    //Move pieces

    
    // Save cell as target
    targetElem = document.getElementById(elem.id)


    // if(targetElem !== null && elem.classList !== 'blank'){
    //     selectedCell = document.getElementById(elem.id)
    //     selectedCell.classList = targetElem.classList
    //     targetElem.classList = 'blank'
    //     // targetElem = null
    // }
    // else{
          

    // }
}