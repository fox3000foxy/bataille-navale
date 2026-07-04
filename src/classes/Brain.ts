import { Board } from "./Board";

export abstract class Brain {
  abstract think(): { x: number; y: number };
  abstract turn(x: number, y: number): void;
  abstract getAdversaryBoard(): Board;
}
