let canvas = document.getElementById("screen")
let ctx = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cellSize = 5

// state is boolean value. true = on, false = off
// unless it's an outline, then none of that matters
class Cell {
  constructor(state,outline) {
    this.state = state
    this.outline = outline
    this.w = cellSize
    this.h = cellSize
  }

  isAlive() { return this.state && !this.outline }
  isDead() { return !this.state && !this.outline }
  isOutline() { return this.outline }

  draw(x,y,fillColor,outlineColor) {
    ctx.fillStyle = "white"
    if (this.state) { ctx.fillStyle = fillColor }
    if (this.outline) { ctx.fillStyle = outlineColor }

    ctx.fillRect(x,y,this.w,this.h)
  }
}

class Grid {
  constructor(x,y,w,h,hue) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.hue = hue
    this.fillColor = 'hsl('+this.hue+',100%,50%)'
    this.outlineColor = 'hsl('+this.hue+',100%,25%)'
    this.arr = [[]]

    for (var i = 0; i < this.w; i++) {
      for (var j = 0; j < this.h; j++) {
        this.arr[i].push(new Cell(false, false))
      }
      this.arr.push([])
    }
  }

  draw() {
    for (var x = 0; x < this.w; x++) {
      for (var y = 0; y < this.h; y++) {
        this.arr[x][y].draw(x*cellSize+this.x, y*cellSize+this.y, this.fillColor, this.outlineColor)
      }
    }
  }
}

function whiteNoise(grid) {
  for (var x = 1; x < 5; x++) {
    for (var y = 1; y < 9; y++) {
      if (Math.random() < 0.5) {
        grid.arr[x][y].state = true
      }
    }
  }
}

let coords = [[0,1],[1,0],[0,-1],[-1,0]]

function getNeighbours(grid,x,y) {
  var num = 0
  coords.forEach(i => {
    if (grid.arr[x + i[0]][y + i[1]].isAlive()) {
      num += 1
    }
  })
  return num
}

/*
Change the state according to the following rules.

Any live cell with two or three neighbors survives.
Any dead cell with one or less live neighbors becomes a live cell.
All other live cells die in the next generation. Similarly, all other dead cells stay dead.
*/

function automata(grid, steps) {
  for (var step = 1; step < steps; step++) {
    let old_grid = grid

    for (var x = 1; x < grid.w/2; x++) {
      for (var y = 1; y < grid.h-1; y++) {
        let neighbours = getNeighbours(old_grid,x,y)
        let cell = old_grid.arr[x][y]

        if (cell.isAlive() && (neighbours == 2 || neighbours == 3)) {
          grid.arr[x][y].state = true
        } else if (cell.isDead() && neighbours <= 1) {
          grid.arr[x][y].state = true
        } else {
          if (cell.isAlive()) { grid.arr[x][y].state = false }
          if (cell.isDead()) { grid.arr[x][y].state = false }
        }
      }
    }
  }
}

function mirror(grid) {
  let old_grid = grid
  var grid_x = 5
  var grid_y = 1
  for (var x = 4; x > 0; x--) {
    for (var y = 1; y < 9; y++) {
      grid.arr[grid_x][grid_y] = old_grid.arr[x][y]
      grid_y += 1
    }
    grid_x += 1
    grid_y = 1
  }

}

function outline(grid) {
  for (var x = 1; x < grid.w-1; x++) {
    for (var y = 1; y < 9; y++) {
      // find alive cells
      if (grid.arr[x][y].isAlive()) {
        // place outlines on all the dead cells surrounding them
        coords.forEach(i => {
          if (grid.arr[x + i[0]][y + i[1]].isDead()) {
            grid.arr[x + i[0]][y + i[1]].outline = true
          }
        })
      }
    }
  }
}

function newSprite(x,y,hue) {
  let grid = new Grid(x,y,10,10,hue)
  whiteNoise(grid)
  automata(grid,1)
  mirror(grid)
  outline(grid)
  grid.draw()
}
