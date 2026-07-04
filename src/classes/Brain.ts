import { Board } from "./Board";

/** Abstract base class for implementing a player's decision making logic. */
export abstract class Brain {
  /**
   * Decides the next coordinate to attack.
   * @returns An object with the x and y coordinates of the chosen target.
   */
  abstract think(): { x: number; y: number };

  /**
   * Notifies the brain of the opponent's move.
   * @param x The x coordinate attacked by the opponent.
   * @param y The y coordinate attacked by the opponent.
   */
  abstract turn(x: number, y: number): void;

  /**
   * Returns the brain's current knowledge of the adversary's board.
   * @returns The adversary board as known by this brain.
   */
  abstract getAdversaryBoard(): Board;
}
