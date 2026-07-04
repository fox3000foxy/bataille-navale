import { Board } from "./Board";
import { Strategy } from "./Strategy";

export class Game {
  board1: Board;
  board2: Board;
  strategy1: Strategy;
  strategy2: Strategy;

  constructor() {
    this.board1 = new Board();
    this.board2 = new Board();
    this.strategy1 = new Strategy();
    this.strategy2 = new Strategy();
  }
}
