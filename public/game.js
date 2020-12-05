// Create a fucking board
function genBoard(){
    var cell = document.createElement("div");
    rows=["1","2","3","4","5","6","7","8"]
    columns=["a","b","c","d","e","f","g","h"]
    let rowId, columnId
    for( i=0; i < rows.length; i++){
        var rowId = rows[i]

        for( i=0; i<8; i++){

        }
    }
    cell.id="a7";
    cell.classList="blank"
    cell.setAttribute("style", "grid-area: 7/a;");
    cell.setAttribute("onclick", "myFunction(this.id)");
    document.querySelector(".board").appendChild(cell);
}

genBoard()


function myFunction(elem) {
    var element = document.getElementById(elem);
    // element.classList.add("selected");
    element.classList.toggle("selected");
    // console.log(elem)
  }