import { State } from "../types/State";

export class Board {
  board: State[][];

  constructor() {
    this.board = Array.from({ length: 11 }, () =>
      Array.from({ length: 11 }, () => State.None),
    );
  }
}
