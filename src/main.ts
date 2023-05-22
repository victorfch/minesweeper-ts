import { BoardData, Cell } from './interfaces';
import './style.css'
let app = document.querySelector("#app") as HTMLDivElement
let form = app.querySelector(".form-create-board") as HTMLFormElement;


const getBoardData = (data: BoardData) => {
  const cellsWithBomb: Cell[] = Array(data.bombs).fill({hasBomb: true, isOpen: false})
  const cellsNoBomb = Array(data.rows * data.cols - data.bombs).fill({hasBomb: false, isOpen: false})
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
  const buttons: HTMLButtonElement[] = []
  board.forEach((cell, id) => {
    const btn = document.createElement("button")
    btn.classList.add("board__cell")
    btn.setAttribute("data-cell", String(id))
    cell.htmlElement = btn
    buttons.push(btn)
  })
  boardDiv.append(...buttons)

  app.appendChild(boardDiv)
}

const revealCell = (button: HTMLButtonElement, board: Cell[]) => {
  const id = Number(button.dataset.cell)
  const cell = board[id]
  cell.isOpen = true
  button.classList.add("board__cell--open")

  if (cell.hasBomb) {
    button.classList.add("board__cell--bomb")
  } else if (cell.number != 0) {
    button.textContent = String(board[id].number)
  } else {
    propagateOpenCell(cell, board)
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
    const neighboursCells = getNeighbours(board, cell)
    const bombs = neighboursCells.reduce((acc, cell) => acc + (cell?.hasBomb ? 1 : 0), 0)

    cell.number = bombs
  })
}

form.addEventListener("submit", handleForm)

function propagateOpenCell(cell: Cell, board: Cell[]) {
  const neighbours = getNeighbours(board, cell)

  neighbours.forEach((neighbour) => {
    if (!neighbour?.isOpen && !neighbour?.hasBomb) {
      neighbour && revealCell(neighbour.htmlElement, board)
    }
  })
}

function getNeighbours(board: Cell[], cell: Cell) {
  const topLeft = getCell(board, cell.row-1, cell.col-1)
  const topCenter = getCell(board, cell.row-1, cell.col)
  const topRight = getCell(board, cell.row-1, cell.col+1)
  const behind = getCell(board, cell.row, cell.col-1)
  const front = getCell(board, cell.row, cell.col+1)
  const bottomLeft = getCell(board, cell.row+1, cell.col-1)
  const bottomCenter = getCell(board, cell.row+1, cell.col)
  const bottomRight = getCell(board, cell.row+1, cell.col+1)

  return [
    topLeft,
    topCenter,
    topRight,
    behind,
    front,
    bottomLeft,
    bottomCenter,
    bottomRight
  ].filter(element => element)
}
