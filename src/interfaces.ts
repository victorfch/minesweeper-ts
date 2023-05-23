export interface ICell {
  hasBomb: boolean,
  isOpen: boolean,
  row: number,
  col: number,
  htmlElement: HTMLButtonElement,
  number?: number
}

export interface IBoardData {
  rows: number,
  cols: number,
  bombs: number
}

export interface IBoard {
  cells: ICell[],
  rows: number,
  cols: number,
  bombs: number
}