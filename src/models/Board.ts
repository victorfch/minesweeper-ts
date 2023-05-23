import { IBoard, IBoardData, ICell } from "../interfaces"
import { Cell } from "./Cell"

export class Board implements IBoard {
  cells: ICell[]
  bombs: number
  rows: number
  cols: number

  constructor(boardData: IBoardData) {
    this.bombs = boardData.bombs
    this.rows = boardData.rows
    this.cols = boardData.cols

    const cellsWithBomb: ICell[] = Array(this.bombs).fill(new Cell(true))
    const cellsNoBomb = Array(this.rows * this.cols - this.bombs).fill(new Cell(false))
    this.cells = cellsNoBomb.concat(cellsWithBomb)
    this.cells.sort(() => 0.5 - Math.random())
  }

  generateRowsAndCols = () => {
    for (let index = 0; index < this.cells.length; index++) {
      const cell = { ...this.cells[index] }
      cell.row = Math.floor(index / this.cols)
      cell.col = index % this.cols
      this.cells[index] = cell;
    }
  }

  countBombs = () => {
    this.cells.forEach(cell => {
      const neighboursCells = this.getNeighbours(cell)
      const bombs = neighboursCells.reduce((acc, cell) => acc + (cell?.hasBomb ? 1 : 0), 0)
  
      cell.number = bombs
    })
  }

  getCell = (row: number, col: number) => {
    return this.cells.find((cell) => cell.row == row && cell.col == col)
  } 

  getNeighbours = (cell: ICell) => {
    const topLeft = this.getCell(cell.row-1, cell.col-1)
    const topCenter = this.getCell(cell.row-1, cell.col)
    const topRight = this.getCell(cell.row-1, cell.col+1)
    const behind = this.getCell(cell.row, cell.col-1)
    const front = this.getCell(cell.row, cell.col+1)
    const bottomLeft = this.getCell(cell.row+1, cell.col-1)
    const bottomCenter = this.getCell(cell.row+1, cell.col)
    const bottomRight = this.getCell(cell.row+1, cell.col+1)
  
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

  renderHtml = (app: HTMLDivElement) => {
    let boardDiv = document.createElement("div") as HTMLDivElement
    boardDiv.className = "board"
    boardDiv.style.gridTemplateColumns = `repeat(${this.cols}, min-content)`
    const buttons: HTMLButtonElement[] = []

    this.cells.forEach((cell, id) => {
      const btn = document.createElement("button")
      btn.classList.add("board__cell")
      btn.setAttribute("data-cell", String(id))
      cell.htmlElement = btn
      buttons.push(btn)
    })

    boardDiv.append(...buttons)
    app.appendChild(boardDiv)
  }

  addListenerToButtons = (app: HTMLDivElement) => {
    const buttons = [...app.querySelectorAll(".board__cell")] as HTMLButtonElement[]
    
    buttons.forEach((btn: HTMLButtonElement) => {
      btn.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        this.addFlag(btn)
      })


      btn.addEventListener("click", this.handleClick)
    })
  }

  handleClick = (event: MouseEvent) => {
    const btn = event.target as HTMLButtonElement
    if (!btn.classList.contains("board__cell--flag")) {
      this.revealCell(btn);
    }
  }

  revealCell = (button: HTMLButtonElement) => {
    const id = Number(button.dataset.cell)
    const cell = this.cells[id]
    console.log(cell)
    //cell.markAsOpen()
    cell.isOpen = true
    button.classList.add("board__cell--open")
  
    if (cell.hasBomb) {
      button.classList.add("board__cell--bomb")
      this.gameOver()
    } else if (cell.number != 0) {
      button.textContent = String(cell.number)
    } else {
      this.propagateOpenCell(cell)
    }
  }

  propagateOpenCell = (cell: ICell) => {
    const neighbours = this.getNeighbours(cell)
    
    neighbours.forEach((neighbour) => {
      if (!neighbour?.isOpen && !neighbour?.hasBomb) {
        neighbour && this.revealCell(neighbour.htmlElement)
      }
    })
  }

  gameOver = () => {
    this.cells.forEach(cell => {
      if (cell.hasBomb) {
        cell.htmlElement.classList.add("board__cell--open")
        cell.htmlElement.classList.add("board__cell--bomb")
      }
      cell.htmlElement.removeEventListener("click", this.handleClick)
    })
  }

  addFlag = (btn: HTMLButtonElement) => {
    btn.classList.toggle("board__cell--flag")
  }
}