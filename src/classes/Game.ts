import { Board } from "./Board";
import { Strategy } from "./Strategy";

/** Represents a game instance with two players, each having their own board and placement strategy. */
export class Game {
  /** The board tracking hits against player 1. */
  board1: Board;
  /** The board tracking hits against player 2. */
  board2: Board;
  /** The boat placement strategy for player 1. */
  strategy1: Strategy;
  /** The boat placement strategy for player 2. */
  strategy2: Strategy;

  /** Initializes a new game with two empty boards and two empty strategies. */
  constructor() {
    this.board1 = new Board();
    this.board2 = new Board();
    this.strategy1 = new Strategy();
    this.strategy2 = new Strategy();
  }
}
