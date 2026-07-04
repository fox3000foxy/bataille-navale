import { Brain } from "./Brain";
import { Game } from "./Game";
import { Board } from "./Board";
import { State } from "../types/State";
import { Strategy } from "./Strategy";

/** Result for a single bot in a batch calculation. */
export interface BotResult {
	/** The display name of the bot. */
	name: string;
	/** The fraction of games won by this bot. */
	successRate: number;
}

/**
 * Runs multiple game iterations between two bots and computes their respective success rates.
 * For each iteration fresh bot instances are created to ensure independent random placements and states.
 */
export class BatchCalculator {
	/**
	 * Runs the specified number of game iterations between two brains.
	 * @param brain1 The first bot (template instance used for its constructor).
	 * @param brain2 The second bot (template instance used for its constructor).
	 * @param iterations The number of game iterations to run.
	 * @returns An array of two BotResult objects, one for each bot.
	 */
	calculate(brain1: Brain, brain2: Brain, iterations: number): BotResult[] {
		let wins1 = 0;
		const maxTurns = 200;

		for (let i = 0; i < iterations; i++) {
			const b1 = this.createFresh(brain1);
			const b2 = this.createFresh(brain2);
			const game = new Game(b1, b2);
			game.strategy1 = b1.getStrategy();
			game.strategy2 = b2.getStrategy();

			let turns = 0;
			while (turns < maxTurns) {
				game.play();
				turns++;

				if (this.isAllSunk(game.strategy1, game.board1)) {
					break;
				}
				if (this.isAllSunk(game.strategy2, game.board2)) {
					wins1++;
					break;
				}
			}
		}

		return [
			{ name: brain1.name, successRate: wins1 / iterations },
			{ name: brain2.name, successRate: (iterations - wins1) / iterations },
		];
	}

	/**
	 * Creates a fresh instance of the same brain type.
	 * @param brain The template brain instance.
	 * @returns A new instance of the same brain class.
	 */
	private createFresh(brain: Brain): Brain {
		const Constructor = brain.constructor as new () => Brain;
		return new Constructor();
	}

	/**
	 * Checks whether all boats in a strategy have been sunk on the given board.
	 * @param strategy The strategy to check.
	 * @param board The board to inspect.
	 * @returns True if every cell of every boat is marked as Sunk.
	 */
	private isAllSunk(strategy: Strategy, board: Board): boolean {
		return strategy.placements.every((p) =>
			strategy.getCells(p).every((c) => board.board[c.x]?.[c.y] === State.Sunk)
		);
	}
}
