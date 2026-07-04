import { Brain, Board, Strategy } from "@navalcode/sdk";
import type { Direction } from "@navalcode/sdk";
import { Boats, State } from "@navalcode/sdk";

export class Random extends Brain {
  private myBoard: Board;
  private myStrategy: Strategy;
  private targetedCells: Set<string>;

  constructor() {
    super();
    this.name = "RandomBot";
    this.myBoard = new Board();
    this.myStrategy = new Strategy();
    this.targetedCells = new Set();
    this.myStrategy = this.generateStrategy();
  }

  getStrategy(): Strategy {
    return this.myStrategy;
  }

  private generateStrategy(): Strategy {
    const boatTypes = [
      Boats.AircraftCarrier,
      Boats.Cruiser,
      Boats.TorpedoBoat,
      Boats.Submarine,
    ];
    const directions: Direction[] = ["left", "right", "up", "down"];

    for (const boat of boatTypes) {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 11);
        const y = Math.floor(Math.random() * 11);
        const direction = directions[Math.floor(Math.random() * 4)]!;
        const testCells = this.getCellsForBoat(boat, x, y, direction);

        const valid = testCells.every(
          (cell) =>
            cell.x >= 0 &&
            cell.x < 11 &&
            cell.y >= 0 &&
            cell.y < 11 &&
            !this.myStrategy.isHit(cell.x, cell.y)
        );

        if (valid) {
          this.myStrategy.addBoat(boat, x, y, direction);
          placed = true;
        }
      }
    }

    return this.myStrategy;
  }

  private getCellsForBoat(
    boat: Boats,
    x: number,
    y: number,
    direction: Direction
  ): { x: number; y: number }[] {
    const cells: { x: number; y: number }[] = [];
    for (let i = 0; i < boat; i++) {
      switch (direction) {
        case "right":
          cells.push({ x: x + i, y });
          break;
        case "left":
          cells.push({ x: x - i, y });
          break;
        case "down":
          cells.push({ x, y: y + i });
          break;
        case "up":
          cells.push({ x, y: y - i });
          break;
      }
    }
    return cells;
  }

  think(): { x: number; y: number } {
    let x: number;
    let y: number;
    do {
      x = Math.floor(Math.random() * 11);
      y = Math.floor(Math.random() * 11);
    } while (this.targetedCells.has(`${x},${y}`));
    this.targetedCells.add(`${x},${y}`);
    return { x, y };
  }

  turn(x: number, y: number): void {
    if (this.myStrategy.isHit(x, y)) {
      this.myBoard.board[x]![y] = State.Hit;
      const sunk = this.myStrategy.isSunk(this.myBoard.board);
      if (sunk) {
        for (const cell of this.myStrategy.getCells(sunk)) {
          this.myBoard.board[cell.x]![cell.y] = State.Sunk;
        }
      }
    }
  }
}
