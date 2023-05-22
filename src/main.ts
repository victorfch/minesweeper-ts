import { BoardData, Cell } from './interfaces';
import './style.css'
let app = document.querySelector("#app") as HTMLDivElement
let form = app.querySelector(".form-create-board") as HTMLFormElement;


const getBoardData = (data: BoardData) => {
  const cellsWithBomb: Cell[] = Array(data.bombs).fill({hasBomb: true})
  const cellsNoBomb = Array(data.rows * data.cols - data.bombs).fill({hasBomb: false})
  const mix: Cell[] = cellsNoBomb.concat(cellsWithBomb)
  mix.sort(() => 0.5 - Math.random())

  generateRowsAndCols(mix, data.cols)
  countBombs(mix)

  return mix
}

const getInput = (elements: HTMLFormControlsCollection, name: string) => {
  return Number((<HTMLInputElement>elements.namedItem(name)).value)
}

const buildBoardUI = (board: Cell[], cols: number) => {
  let boardDiv = document.createElement("div") as HTMLDivElement
  boardDiv.className = "board"
  boardDiv.style.gridTemplateColumns = `repeat(${cols}, min-content)`
  board.forEach((_, id) => {
    boardDiv.innerHTML += `<button class="board__cell" data-cell="${id}"></button>` 
  })

  app.appendChild(boardDiv)
}

const revealCell = (cell: HTMLButtonElement, board: Cell[]) => {
  const id = Number(cell.dataset.cell)
  cell.classList.add("board__cell--open")
  if (board[id].hasBomb) {
    cell.classList.add("board__cell--bomb")
  } else {
    if (board[id].number) {
      cell.textContent = String(board[id].number)
    }
  }
}

const addListenerToCells = (board: Cell[]) => {
  const cells = [...app.querySelectorAll(".board__cell")] as HTMLButtonElement[]

  cells.forEach((cell: HTMLButtonElement) => {
    cell.addEventListener("click", () => {
      revealCell(cell, board)
    })
  })
}

const handleForm = (e: SubmitEvent) => {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const elements = form.elements

  const rows = getInput(elements, "rows")
  const cols = getInput(elements, "cols")
  const bombs = getInput(elements, "bombs")

  const board: Cell[] = getBoardData({rows, cols, bombs})
  buildBoardUI(board, cols)
  addListenerToCells(board)
  console.log(board)
}

form.addEventListener("submit", handleForm)


function generateRowsAndCols(mix: Cell[], cols: number) {
  for (let indice = 0; indice < mix.length; indice++) {
    const cell = { ...mix[indice] }
    cell.row = Math.floor(indice / cols)
    cell.col = indice % cols
    mix[indice] = cell;
  }
}

const getCell = (board: Cell[], row: number, col: number) => {
  return board.find((cell) => cell.row == row && cell.col == col)
} 

function countBombs(board: Cell[]) {
  board.forEach(cell => {
    const topLeft = getCell(board, cell.row-1, cell.col-1)?.hasBomb ? 1 : 0
    const topCenter = getCell(board, cell.row-1, cell.col)?.hasBomb ? 1 : 0
    const topRight = getCell(board, cell.row-1, cell.col+1)?.hasBomb ? 1 : 0
    const behind = getCell(board, cell.row, cell.col-1)?.hasBomb ? 1 : 0
    const front = getCell(board, cell.row, cell.col+1)?.hasBomb ? 1 : 0
    const bottomLeft = getCell(board, cell.row+1, cell.col-1)?.hasBomb ? 1 : 0
    const bottomCenter = getCell(board, cell.row+1, cell.col)?.hasBomb ? 1 : 0
    const bottomRight = getCell(board, cell.row+1, cell.col+1)?.hasBomb ? 1 : 0
    const totalUp = topLeft + topCenter + topRight
    const totalBottom = bottomLeft + bottomCenter + bottomRight
    const total = totalUp + behind + front + totalBottom
    
    if (!cell.hasBomb) {
      cell.number = total
    }
  })
  
}
