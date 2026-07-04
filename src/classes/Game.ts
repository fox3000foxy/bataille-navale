import { Board } from "./Board";
import { Brain } from "./Brain";
import { State } from "../types/State";
import { Strategy } from "./Strategy";

/** Represents a game instance with two players, each having their own board, placement strategy, and brain. */
export class Game {
	/** The board tracking hits against player 1. */
	board1: Board;
	/** The board tracking hits against player 2. */
	board2: Board;
	/** The boat placement strategy for player 1. */
	strategy1: Strategy;
	/** The boat placement strategy for player 2. */
	strategy2: Strategy;
	/** The brain controlling player 1. */
	brain1: Brain;
	/** The brain controlling player 2. */
	brain2: Brain;
	/** Indicates which player is currently active (1 or 2). */
	activePlayer: 1 | 2;

	/**
	 * Initializes a new game with two empty boards, two empty strategies, and two brains.
	 * @param brain1 The brain controlling player 1.
	 * @param brain2 The brain controlling player 2.
	 */
	constructor(brain1: Brain, brain2: Brain) {
		this.board1 = new Board();
		this.board2 = new Board();
		this.strategy1 = new Strategy();
		this.strategy2 = new Strategy();
		this.brain1 = brain1;
		this.brain2 = brain2;
		this.brain1.setAdversaryBoard(this.board2);
		this.brain2.setAdversaryBoard(this.board1);
		this.activePlayer = 1;
	}

	/** Executes one turn for the active player. The active brain picks a target, the opponent board is updated, and the turn passes to the other player. */
	play(): void {
		const isPlayer1 = this.activePlayer === 1;
		const activeBrain = isPlayer1 ? this.brain1 : this.brain2;
		const opponentBrain = isPlayer1 ? this.brain2 : this.brain1;
		const opponentBoard = isPlayer1 ? this.board2 : this.board1;
		const opponentStrategy = isPlayer1 ? this.strategy2 : this.strategy1;

		const { x, y } = activeBrain.think();
		const hit = opponentStrategy.isHit(x, y);

		if (hit) {
			opponentBoard.board[x]![y] = State.Hit;

			const sunk = opponentStrategy.isSunk(opponentBoard.board);
			if (sunk) {
				for (const cell of opponentStrategy.getCells(sunk)) {
					opponentBoard.board[cell.x]![cell.y] = State.Sunk;
				}
			}
		}

		opponentBrain.turn(x, y);
		this.activePlayer = isPlayer1 ? 2 : 1;
	}
}
