var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight

var CELL_SIZE = 20

var ROWS = Math.floor(HEIGHT / CELL_SIZE) 
var COLS = Math.floor(WIDTH / CELL_SIZE)
var FPS = 35

var canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT
document.body.appendChild(canvas)

var ctx = canvas.getContext('2d')

var grid = {}
for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
        if (!grid[y])
            grid[y] = {}
        grid[y][x] = new Cell(x, y)
    }
}




var currentCell = grid[0][0]
currentCell.visited = true

var stack = Array()



function draw() {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    for (var y in grid) {
        for (var x in grid[y]) {
            grid[y][x].show()
        }
    }

    currentCell.hightlight()

    if (getUnvisitedCellOfGrid().length > 0) {
        if (currentCell.getUnvisitedNeighbours().length > 0) {
            var neighbour = currentCell.getRandomUnvisitedNeighbours()
            if (neighbour) {
                stack.push(currentCell)
                removeWallBetweenCells(currentCell, neighbour)
                neighbour.visited = true
                currentCell = neighbour
            }
        } else if (stack.length > 0) {
            currentCell = stack.pop()
        }
    }

    setTimeout(function() { requestAnimationFrame(draw) }, 1000 / FPS)
}

draw()







function Cell(x, y) {
    this.x = x
    this.y = y

    this.walls = { top: true, right: true, bottom: true, left: true }
    this.visited = false

    this.show = function() {
        if (this.visited) {
            ctx.fillStyle = '#7f8c8d'
            ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }

        if (this.walls.top && this.visited)
            this.drawLine(this.x * CELL_SIZE, this.y * CELL_SIZE, this.x * CELL_SIZE + CELL_SIZE, this.y * CELL_SIZE)

        if (this.walls.right && this.visited)
            this.drawLine(this.x * CELL_SIZE + CELL_SIZE, this.y * CELL_SIZE, this.x * CELL_SIZE + CELL_SIZE, this.y * CELL_SIZE + CELL_SIZE)

        if (this.walls.bottom && this.visited)
            this.drawLine(this.x * CELL_SIZE, this.y * CELL_SIZE + CELL_SIZE, this.x * CELL_SIZE + CELL_SIZE, this.y * CELL_SIZE + CELL_SIZE)

        if (this.walls.bottom && this.visited)
            this.drawLine(this.x * CELL_SIZE, this.y * CELL_SIZE + CELL_SIZE, this.x * CELL_SIZE + CELL_SIZE, this.y * CELL_SIZE + CELL_SIZE)
    }

    this.hightlight = function() {
        ctx.fillStyle = '#2c3e50'
        ctx.fillRect(this.x * CELL_SIZE + 6, this.y * CELL_SIZE + 6, CELL_SIZE - 12, CELL_SIZE - 12)
    }

    this.drawLine = function(sX, sY, eX, eY) {
        ctx.beginPath()
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#FFFFFF';
        ctx.moveTo(sX, sY)
        ctx.lineTo(eX, eY)
        ctx.stroke();
    }

    this.getRandomUnvisitedNeighbours = function() {
        var cells = this.getUnvisitedNeighbours()
        var i = Math.round(Math.random() * (cells.length - 1))
        return cells[i]
    }

    this.getUnvisitedNeighbours = function() {
        var top = undefined
        if (this.y - 1 > 0 && this.y - 1 < COLS)
            top = grid[this.y - 1][this.x]

        var right = undefined
        if (this.x + 1 > 0 && this.x + 1 < ROWS)
            right = grid[this.y][this.x + 1]

        var bottom = undefined
        if (this.y + 1 > 0 && this.y + 1 < ROWS)
            bottom = grid[this.y + 1][this.x]

        var left = undefined
        if (this.x - 1 > 0 && this.x - 1 < ROWS)
            left = grid[this.y][this.x - 1]

        var cells = Array()
        if (top && !top.visited)
            cells.push(top)

        if (right && !right.visited)
            cells.push(right)

        if (bottom && !bottom.visited)
            cells.push(bottom)

        if (left && !left.visited)
            cells.push(left)

        return cells
    }
}







function getUnvisitedCellOfGrid() {
    var cells = Array()
    for (var y in grid) {
        for (var x in grid[y]) {
            var cell = grid[y][x]
            if (!cell.visited)
              cells.push(cell)  
        }
    }
    return cells
}

function removeWallBetweenCells(a, b) {

    if (a.x > b.x) {
        a.walls.left = false
        b.walls.right = false
    } 

    if (a.x < b.x) {
        b.walls.left = false
        a.walls.right = false
    } 

    if (a.y > b.y) {
        a.walls.top = false
        b.walls.bottom = false
    } 

    if (a.y < b.y) {
        b.walls.top = false
        a.walls.bottom = false
    }    
}