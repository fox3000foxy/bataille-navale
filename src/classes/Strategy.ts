import { Boats } from "../types/Boats";
import { State } from "../types/State";

/** Direction in which a boat extends from its starting coordinate. */
export type Direction = "left" | "right" | "up" | "down";

/** Describes the placement of a single boat on the board. */
export interface BoatPlacement {
	/** The type of boat placed. */
	boat: Boats;
	/** The x coordinate (column) of the starting cell of the boat. */
	x: number;
	/** The y coordinate (row) of the starting cell of the boat. */
	y: number;
	/** The direction in which the boat extends from the starting cell. */
	direction: Direction;
}

/** Defines a placement strategy for all boats on a board. Provides methods to check hits and detect sunken ships. */
export class Strategy {
	/** The list of boat placements that make up this strategy. */
	placements: BoatPlacement[];

	/** Initializes an empty strategy with no boats placed. */
	constructor() {
		this.placements = [];
	}

	/**
	 * Adds a boat placement to the strategy.
	 * @param boat The type of boat to place.
	 * @param x The x coordinate (column) of the starting cell.
	 * @param y The y coordinate (row) of the starting cell.
	 * @param direction The direction in which the boat extends.
	 */
	addBoat(boat: Boats, x: number, y: number, direction: Direction): void {
		this.placements.push({ boat, x, y, direction });
	}

	/**
	 * Returns all cells occupied by a given boat placement.
	 * @param placement The boat placement to evaluate.
	 * @returns An array of coordinate objects for each occupied cell.
	 */
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

	/**
	 * Checks whether a given coordinate hits any placed boat.
	 * @param x The x coordinate (column) to check.
	 * @param y The y coordinate (row) to check.
	 * @returns The BoatPlacement that was hit, or undefined if no boat occupies the cell.
	 */
	isHit(x: number, y: number): BoatPlacement | undefined {
		return this.placements.find((p) =>
			this.getCells(p).some((c) => c.x === x && c.y === y)
		);
	}

	/**
	 * Checks whether any boat has been completely hit (all its cells are in Hit state).
	 * @param hitBoard The current board state showing which cells have been hit.
	 * @returns The BoatPlacement that is sunk, or undefined if no boat is fully hit.
	 */
	isSunk(hitBoard: State[][]): BoatPlacement | undefined {
		return this.placements.find((p) =>
			this.getCells(p).every((c) => hitBoard[c.x]?.[c.y] === State.Hit)
		);
	}
}
