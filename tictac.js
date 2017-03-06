var GameState = {
    ONE: 0,
    TWO: 1
}

var state = GameState.PREGAME;

var cells = [];
var gameDiv;

window.onresize = resize;

$(document).ready(function(){
    gameDiv = $("#gameContainer");
    for (var i = 0; i < 9; i++)
    {
        var inner = $("<div></div>");
        inner.on("touchstart", onCellClick);
        inner.on("mousedown", onCellClick);
        cells.push(inner);
        
        var div = $("<div></div>");
        div.addClass("outer");
        div.append(inner);
        div.attr("index", i);
        gameDiv.append(div);
    }
    resize();
    reset();
    state = GameState.ONE;
});

function resize()
{
    gameDiv.height(gameDiv.width());
    $.each(gameDiv.children(), function(i, obj){
        var cell = $(obj);
        cell.height(cell.width());
    });
}

function onCellClick(e){
    e.preventDefault();
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
        cells[i].removeClass();
        cells[i].attr("team", "");
        cells[i].css("background-color", "");
    }
    gameDiv.removeClass("raised");
    setTimeout(function(){
        gameDiv.addClass("raised");
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
            if (!cells[i].attr("team"))
                complete = false;
        if (complete)
            gameOver();
    }
}

function checkCells(cell1, cell2, cell3)
{
    if (cell1 < 0 || cell2 < 0 || cell3 < 0 || cell1 > cells.length || cell2 > cells.length || cell3 > cells.length)
        console.log("out of bounds");
    var team = cells[cell1].attr("team");
    if (team && cells[cell2].attr("team") == team && cells[cell3].attr("team") == team)
    {
        for (var i = 0; i < 3; i++)
            cells[arguments[i]].addClass("victory");
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