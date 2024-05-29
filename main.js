const board = document.querySelector('#game-board')
const boardCells = []

const SIDE = 50 // Grid size
document.body.style.setProperty('--side', SIDE)

const INTERVAL = 150 // Interval in milliseconds

let cells = Array.from({ length: SIDE * SIDE }, (_, idx) => {
  const cell = document.createElement('div')
  let state = 0
  cell.classList.add('cell')
  // if ([7, 17, 27, 28, 19].includes(idx)) {
  //   cell.classList.add('alive')
  //   state = 1
  // }
  cell.addEventListener('click', () => {
    state = 1 - state
    cell.classList.toggle('alive')
    cells[idx] = state
  })
  boardCells.push(cell)
  board.appendChild(cell)
  return state
})

const getLivingNeighbours = (i, array) => {
  const length = array.length
  let count = 0
  const directions = [
    -SIDE - 1,
    -SIDE,
    -SIDE + 1,
    -1,
    1,
    SIDE - 1,
    SIDE,
    SIDE + 1,
  ]

  directions.forEach((dir) => {
    const neighbourIdx = i + dir
    if (neighbourIdx >= 0 && neighbourIdx < length) {
      // Check for edge cases
      const isLeftEdge = i % SIDE === 0
      const isRightEdge = i % SIDE === SIDE - 1

      if ((dir === -SIDE - 1 || dir === -1 || dir === SIDE - 1) && isLeftEdge)
        return
      if ((dir === -SIDE + 1 || dir === 1 || dir === SIDE + 1) && isRightEdge)
        return

      if (array[neighbourIdx] === 1) count++
    }
  })

  return count
}

const checkNeighborsState = (cell, i, current) => {
  const alive = getLivingNeighbours(i, current)

  if (cell === 1) {
    boardCells[i].classList.remove('died')
    boardCells[i].classList.add('alive')
  } else {
    boardCells[i].classList.replace('alive', 'died')
  }

  if (cell === 1 && alive < 2) return 0
  if (cell === 1 && alive >= 2 && alive <= 3) return 1
  if (cell === 1 && alive > 3) return 0
  if (cell === 0 && alive === 3) return 1

  return cell
}

const gamePlay = document.querySelector('#game-play')
const playOnce = document.querySelector('#once')

let gameTick
let lastTime = 0

gamePlay.onclick = () => {
  if (playOnce.checked) {
    tick()
  } else {
    if (!gameTick) {
      gamePlay.textContent = 'STOP'
      gameTick = requestAnimationFrame(gameLoop)
    } else {
      gamePlay.textContent = 'PLAY'
      cancelAnimationFrame(gameTick)
      gameTick = null
    }
  }
}

const gameLoop = (timestamp) => {
  if (timestamp - lastTime > INTERVAL) {
    tick()
    lastTime = timestamp
  }
  gameTick = requestAnimationFrame(gameLoop)
}

const tick = () => {
  const newCells = cells.map((cell, i) => checkNeighborsState(cell, i, cells))
  cells = newCells
  updateBoard()
}

const updateBoard = () => {
  cells.forEach((state, i) => {
    if (state === 1) {
      boardCells[i].classList.remove('died')
      boardCells[i].classList.add('alive')
    } else {
      boardCells[i].classList.replace('alive', 'died')
    }
  })
}

const gameReload = document.querySelector('#game-reload')
gameReload.onclick = () => {
  location.reload()
}
