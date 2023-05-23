import { Board } from './models/Board';
import './style.css'
let app = document.querySelector("#app") as HTMLDivElement
let form = app.querySelector(".form-create-board") as HTMLFormElement;

const getInput = (elements: HTMLFormControlsCollection, name: string) => {
  return Number((<HTMLInputElement>elements.namedItem(name)).value)
}

const handleForm = (e: SubmitEvent) => {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const elements = form.elements

  const rows = getInput(elements, "rows")
  const cols = getInput(elements, "cols")
  const bombs = getInput(elements, "bombs")

  const board = new Board({rows, cols, bombs})
  board.generateRowsAndCols()
  board.countBombs()

  //const board: Cell[] = getBoardData({rows, cols, bombs})
  board.renderHtml(app)
  board.addListenerToCells(app)
  console.log(board)
}

form.addEventListener("submit", handleForm)
