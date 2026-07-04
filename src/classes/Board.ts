import { State } from "../types/State";

/** Represents a game board as an 11 by 11 grid of cell states. */
export class Board {
	/** The 11x11 matrix of cell states, indexed by row then column. */
	board: State[][];

	/** Initializes an 11x11 board with all cells set to None. */
	constructor() {
		this.board = Array.from({ length: 11 }, () =>
			Array.from({ length: 11 }, () => State.None)
		);
	}
}
