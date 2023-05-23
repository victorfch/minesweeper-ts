import { ICell } from "../interfaces";

export class Cell implements ICell {
  hasBomb: boolean;
  isOpen: boolean;
  row!: number;
  col!: number;
  htmlElement!: HTMLButtonElement;
  number?: number | undefined;

  constructor(hasBomb: boolean) {
    this.isOpen = false
    this.hasBomb = hasBomb
  }
}