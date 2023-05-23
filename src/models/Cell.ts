import { ICell } from "../interfaces";

export class Cell implements ICell {
  hasBomb: boolean
  isOpen: boolean
  row!: number
  col!: number
  htmlElement!: HTMLButtonElement
  number?: number | undefined

  constructor(hasBomb: boolean) {
    this.isOpen = false
    this.hasBomb = hasBomb
  }
  
  markAsOpen = () => {
    console.log(this)
    this.isOpen = true
    this.htmlElement.classList.add("board__cell--open")
  }

  renderBomb = () => {
    this.htmlElement.classList.add("board__cell--bomb")
  }

  setHtmlElement = (btn: HTMLButtonElement) => {
    this.htmlElement = btn
  }
}