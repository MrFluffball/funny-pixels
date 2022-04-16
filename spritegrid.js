let hues = []
let padding = 50
let amount = 12

// populate the hue function
var prev = 0
for (var i = 0; i < amount; i++) {
  hues.push(prev)
  prev += 320/amount
}

// draw
for (var i = 0; i < amount; i++) {
  for (var j = 0; j < amount; j++) {
    newSprite(20+(i*cellSize*10)+(10*i),20+(j*cellSize*10)+(10*j),hues[i])
  }
}
