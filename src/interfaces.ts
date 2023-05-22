export interface Cell {
  hasBomb: boolean,
  row: number,
  col: number,
  number?: number
}

export interface BoardData {
  rows: number,
  cols: number,
  bombs: number
}