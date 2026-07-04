import { Board } from "./Board";
import type { Boats } from "./Boats";
import type { Direction } from "./Strategy";
import { Strategy } from "./Strategy";

export abstract class Brain {
  name = "Brain";
  private adversaryBoardRef: Board = new Board();

  setAdversaryBoard(board: Board): void {
    this.adversaryBoardRef = board;
  }

  getAdversaryBoard(): Board {
    return this.adversaryBoardRef;
  }

  abstract think(): { x: number; y: number };
  abstract turn(x: number, y: number): void;
  abstract getStrategy(): Strategy;

  placeBoats(...boats: [Boats, Direction, [number, number]][]): Strategy {
    const strategy = new Strategy();
    for (const [type, direction, [x, y]] of boats) {
      strategy.addBoat(type, x, y, direction);
    }
    return strategy;
  }
}
