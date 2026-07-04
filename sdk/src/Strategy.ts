import type { Boats } from "./Boats";
import { State } from "./State";

export type Direction = "left" | "right" | "up" | "down";

export interface BoatPlacement {
  boat: Boats;
  x: number;
  y: number;
  direction: Direction;
}

export class Strategy {
  placements: BoatPlacement[];

  constructor() {
    this.placements = [];
  }

  addBoat(boat: Boats, x: number, y: number, direction: Direction): void {
    this.placements.push({ boat, x, y, direction });
  }

  getCells(placement: BoatPlacement): { x: number; y: number }[] {
    const cells: { x: number; y: number }[] = [];
    for (let i = 0; i < placement.boat; i++) {
      switch (placement.direction) {
        case "right":
          cells.push({ x: placement.x + i, y: placement.y });
          break;
        case "left":
          cells.push({ x: placement.x - i, y: placement.y });
          break;
        case "down":
          cells.push({ x: placement.x, y: placement.y + i });
          break;
        case "up":
          cells.push({ x: placement.x, y: placement.y - i });
          break;
      }
    }
    return cells;
  }

  isHit(x: number, y: number): BoatPlacement | undefined {
    return this.placements.find((p) =>
      this.getCells(p).some((c) => c.x === x && c.y === y)
    );
  }

  isSunk(hitBoard: State[][]): BoatPlacement | undefined {
    return this.placements.find((p) =>
      this.getCells(p).every((c) => hitBoard[c.x]?.[c.y] === State.Hit)
    );
  }
}
