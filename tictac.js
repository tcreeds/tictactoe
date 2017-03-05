var GameState = {
    ONE: 0,
    TWO: 1
}

var state = GameState.PREGAME;

var cells = [];
var gameDiv;

window.onload = function(){
    gameDiv = document.getElementById("gameContainer");
    for (var i = 0; i < 9; i++)
    {
        var inner = document.createElement("div");
        inner.addEventListener("touchstart", onCellClick);
        inner.addEventListener("mousedown", onCellClick);
        cells.push(inner);
        
        var div = document.createElement("div");
        div.className = "outer";
        div.appendChild(inner);
        div.setAttribute("index", i);
        gameDiv.appendChild(div);
    }
    reset();
    state = GameState.ONE;
}

function onCellClick(e){
    console.log("down");
    var i = this.getAttribute("index");
    var clicked = this.getAttribute("team");
    if (!clicked)
    {
        if (state == GameState.ONE)
        {
            this.setAttribute("team", "one");
            this.style.backgroundColor = "blue";
            state = GameState.TWO;
        }
        else if (state == GameState.TWO)
        {
            this.setAttribute("team", "two");
            this.style.backgroundColor = "red";
            state = GameState.ONE;
        }
        checkGameCompletion();
    }
}

function gameOver()
{
    setTimeout(reset, 1000);
    
}

function reset()
{
    for (var i = 0; i < cells.length; i++)
    {
        cells[i].className = "";
        cells[i].removeAttribute("team");
        cells[i].style.backgroundColor = "";
    }
    gameDiv.className = "";
    setTimeout(function(){
        gameDiv.className = "raised";
    }, 1000);
}

function checkGameCompletion()
{
    var horizontal = checkHorizontal();
    var vertical = checkVertical();
    var angle = checkAngles();
    if (horizontal || vertical || angle)
        gameOver();
    else
    {
        var complete = true;
        for (var i = 0; i < cells.length; i++)
            if (!cells[i].getAttribute("team"))
                complete = false;
        if (complete)
            gameOver();
    }
}

function checkCells(cell1, cell2, cell3)
{
    if (cell1 < 0 || cell2 < 0 || cell3 < 0 || cell1 > cells.length || cell2 > cells.length || cell3 > cells.length)
        console.log("out of bounds");
    var team = cells[cell1].getAttribute("team");
    if (team && cells[cell2].getAttribute("team") == team && cells[cell3].getAttribute("team") == team)
    {
        for (var i = 0; i < 3; i++)
            cells[arguments[i]].className = cells[arguments[i]].className + " victory";
        return true;
    };
    return false;
}

function checkHorizontal()
{
    for (var i = 0; i < 9; i+=3)
    {
        if (checkCells(i, i+1, i+2))
            return true;
    }
    return false;
}

function checkVertical()
{
    for (var i = 0; i < 3; i++)
    {
        if (checkCells(i, i+3, i+6))
            return true;
    }
    return false;
}

function checkAngles()
{
    return checkCells(0, 4, 8) || checkCells(2, 4, 6);
}