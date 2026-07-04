import { Boats } from "../types/Boats";
import { State } from "../types/State";

export interface BoatPlacement {
  boat: Boats;
  x: number;
  y: number;
  horizontal: boolean;
}

export class Strategy {
  placements: BoatPlacement[];

  constructor() {
    this.placements = [];
  }

  addBoat(boat: Boats, x: number, y: number, horizontal: boolean): void {
    this.placements.push({ boat, x, y, horizontal });
  }

  getCells(placement: BoatPlacement): { x: number; y: number }[] {
    const cells: { x: number; y: number }[] = [];
    for (let i = 0; i < placement.boat; i++) {
      cells.push(
        placement.horizontal
          ? { x: placement.x + i, y: placement.y }
          : { x: placement.x, y: placement.y + i },
      );
    }
    return cells;
  }

  isHit(x: number, y: number): BoatPlacement | undefined {
    return this.placements.find((p) =>
      this.getCells(p).some((c) => c.x === x && c.y === y),
    );
  }

  isSunk(hitBoard: State[][]): BoatPlacement | undefined {
    return this.placements.find((p) =>
      this.getCells(p).every((c) => hitBoard[c.x]?.[c.y] === State.Hit),
    );
  }
}
