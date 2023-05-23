export interface ICell {
  hasBomb: boolean,
  isOpen: boolean,
  row: number,
  col: number,
  htmlElement: HTMLButtonElement,
  number?: number,
  setHtmlElement: (element: HTMLButtonElement) => void
  markAsOpen: () => void
  renderBomb: () => void
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
  bombs: number,
  generateRowsAndCols: () => void,
  countBombs: () => void,
  renderHtml: (app: HTMLDivElement) => void,
  addListenerToButtons: (app: HTMLDivElement) => void,
  addFlag: (element: HTMLButtonElement) => void
}