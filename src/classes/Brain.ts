import { Board } from "./Board";
import { Boats } from "../types/Boats";
import { type Direction, Strategy } from "./Strategy";

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

  /**
   * Creates a strategy by placing all boats from the given definitions.
   * @param boats A rest parameter of tuples, each containing the boat type, direction, and starting coordinates.
   * @returns A Strategy with all boats placed.
   */
  placeBoats(
    ...boats: [Boats, Direction, [number, number]][]
  ): Strategy {
    const strategy = new Strategy();
    for (const [type, direction, [x, y]] of boats) {
      strategy.addBoat(type, x, y, direction);
    }
    return strategy;
  }
}
