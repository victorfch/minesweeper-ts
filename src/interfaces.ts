export interface Cell {
  hasBomb: boolean,
  isOpen: boolean,
  row: number,
  col: number,
  htmlElement: HTMLButtonElement,
  number?: number
}

export interface BoardData {
  rows: number,
  cols: number,
  bombs: number
}